const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const planetMenu = document.getElementById('planetMenu');
const planetNameElement = document.getElementById('planetName');

const healthElement = document.getElementById('health');
const cargoElement = document.getElementById('cargo');
const fuelElement = document.getElementById('fuel');
const creditsElement = document.getElementById('credits');

const planets = [];
const ship = { x: 0, y: 0, width: 15, height: 10, color: '#ffffff' };

let health = 100;
let cargo = 10;
let fuel = 50;
let credits = 500;

function updateHUD() {
  healthElement.textContent = health;
  cargoElement.textContent = cargo;
  fuelElement.textContent = fuel;
  creditsElement.textContent = credits;
}

function resizeCanvas() {
  const container = document.getElementById('mapContainer');
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  generatePlanets();
  draw();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function generatePlanets() {
  planets.length = 0;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  planets.push({ x: centerX, y: centerY, radius: 30, color: '#ff6600', name: 'Prime Planet' });

  for (let i = 0; i < 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * Math.min(canvas.width, canvas.height) * 0.3;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    planets.push({ x, y, radius: 20, color: ['#ffcc00', '#00bfff', '#ff3399'][i % 3], name: `Planet ${i + 1}` });
  }

  ship.x = centerX - ship.width / 2;
  ship.y = centerY - ship.height / 2;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  planets.forEach((planet, index) => {
    for (let j = index + 1; j < planets.length; j++) {
      ctx.setLineDash([5, 15]);
      ctx.strokeStyle = ['#555555', '#aaaaaa'][j % 2];
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(planet.x, planet.y);
      ctx.lineTo(planets[j].x, planets[j].y);
      ctx.stroke();
    }
  });

  planets.forEach(planet => {
    const gradient = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.radius * 3);
    gradient.addColorStop(0, `${planet.color}33`);
    gradient.addColorStop(1, '#00000000');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.strokeStyle = planet.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '12px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(planet.name, planet.x, planet.y - planet.radius - 5);
  });

  const shipGlow = ctx.createRadialGradient(
    ship.x + ship.width / 2,
    ship.y + ship.height / 2,
    0,
    ship.x + ship.width / 2,
    ship.y + ship.height / 2,
    Math.max(ship.width, ship.height) * 3
  );
  shipGlow.addColorStop(0, '#ffffff33');
  shipGlow.addColorStop(1, '#00000000');
  ctx.fillStyle = shipGlow;
  ctx.fillRect(
    ship.x - ship.width,
    ship.y - ship.height,
    ship.width * 4,
    ship.height * 4
  );

  ctx.fillStyle = ship.color;
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

function moveShipTo(target) {
  const dx = target.x - (ship.x + ship.width / 2);
  const dy = target.y - (ship.y + ship.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = 2;
  const steps = distance / speed;
  const stepX = dx / steps;
  const stepY = dy / steps;

  let currentStep = 0;
  const interval = setInterval(() => {
    if (currentStep >= steps) {
      clearInterval(interval);
      ship.x = target.x - ship.width / 2;
      ship.y = target.y - ship.height / 2;
      openMenu(target);
    } else {
      ship.x += stepX;
      ship.y += stepY;
      currentStep++;
    }
    draw();
  }, 16);
}

canvas.addEventListener('click', (event) => {
  const { offsetX, offsetY } = event;
  planets.forEach(planet => {
    const dx = offsetX - planet.x;
    const dy = offsetY - planet.y;
    if (Math.sqrt(dx * dx + dy * dy) <= planet.radius) {
      console.log(`Clicked on: ${planet.name}`);
      moveShipTo(planet);
    }
  });
});

function openMenu(planet) {
  planetNameElement.textContent = `Welcome to ${planet.name}`;
  planetMenu.style.display = 'block';
}

function closeMenu() {
  planetMenu.style.display = 'none';
}

generatePlanets();
draw();
updateHUD();
