const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const planetMenu = document.getElementById('planetMenu');
const planetNameElement = document.getElementById('planetName');
const actionsContainer = document.getElementById('planetActions');

const planets = [];
const ship = { x: 0, y: 0, width: 15, height: 10, color: '#ffffff' };

// Job and distress call variables
let currentJob = null;
let distressCallActive = false;
let distressCallPlanet = null;

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
  ctx.fillRect(ship.x - ship.width, ship.y - ship.height, ship.width * 4, ship.height * 4);

  ctx.fillStyle = ship.color;
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);

  drawMissionIndicators();
}

function drawArrow(fromX, fromY, toX, toY, color) {
  const headLength = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.setLineDash([]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.lineTo(toX, toY);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawMissionIndicators() {
  const shipCenterX = ship.x + ship.width / 2;
  const shipCenterY = ship.y + ship.height / 2;

  if (currentJob) {
    drawArrow(shipCenterX, shipCenterY, currentJob.targetPlanet.x, currentJob.targetPlanet.y, '#00ff00');
  }

  if (distressCallActive) {
    drawArrow(shipCenterX, shipCenterY, distressCallPlanet.x, distressCallPlanet.y, '#ff0000');
  }
}

function leavePlanet() {
  closeMenu();

  if (!distressCallActive && Math.random() < 0.2) {
    triggerDistressCall();
  }
}

function triggerDistressCall() {
  const availablePlanets = planets.filter(p => p.name !== 'Prime Planet');
  distressCallPlanet = availablePlanets[Math.floor(Math.random() * availablePlanets.length)];
  distressCallActive = true;

  alert(`Distress call received! Travel to ${distressCallPlanet.name} to assist.`);
}

function completeDistressMission() {
  credits += 150;
  distressCallActive = false;
  distressCallPlanet = null;

  alert("Distress mission completed! You earned 150 credits.");
}