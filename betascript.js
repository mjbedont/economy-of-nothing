const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const planetMenu = document.getElementById('planetMenu');
const planetNameElement = document.getElementById('planetName');
const actionsContainer = document.getElementById('planetActions');

// HUD elements
const hudFuel = document.getElementById('fuel');
const hudCredits = document.getElementById('credits');
const hudJob = document.getElementById('job');

// Game state variables
const planets = [];
const ship = { x: 0, y: 0, width: 15, height: 10, color: '#ffffff' };
let fuel = 50;
let credits = 500;
let health = 100;
let currentJob = null;

// Resize canvas
function resizeCanvas() {
  const container = document.getElementById('mapContainer');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  if (planets.length === 0) generatePlanets();
  draw();
}

// Generate planets
function generatePlanets() {
  planets.length = 0;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const padding = 50;

  planets.push({
    x: centerX,
    y: centerY,
    radius: 30,
    color: '#ff6600',
    name: 'Planet Prime',
    distanceFromPrime: 0,
    missionObjective: null,
  });

  for (let i = 0; i < 5; i++) {
    let x, y;
    do {
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * (Math.min(canvas.width, canvas.height) * 0.4);
      x = centerX + Math.cos(angle) * distance;
      y = centerY + Math.sin(angle) * distance;

      x = Math.max(padding, Math.min(canvas.width - padding, x));
      y = Math.max(padding, Math.min(canvas.height - padding, y));
    } while (
      planets.some(
        (p) => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 70
      )
    );

    planets.push({
      x,
      y,
      radius: 20,
      color: ['#ffcc00', '#00bfff', '#ff3399'][i % 3],
      name: `Planet ${i + 1}`,
      distanceFromPrime: Math.round(Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) / 50),
      missionObjective: `Mission ${i + 1}: Complete Task`,
    });
  }

  const primePlanet = planets[0];
  ship.x = primePlanet.x - ship.width / 2;
  ship.y = primePlanet.y - ship.height / 2;
}

// Draw the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawLineArt();
  planets.forEach((planet) => {
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.font = '12px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(planet.name, planet.x, planet.y - planet.radius - 5);
  });

  ctx.fillStyle = ship.color;
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// Draw retro line art
function drawLineArt() {
  ctx.setLineDash([5, 15]);
  ctx.lineWidth = 1;
  planets.forEach((start) => {
    planets.forEach((end) => {
      if (start !== end) {
        const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        gradient.addColorStop(0, '#00ff00');
        gradient.addColorStop(1, '#ff00ff');
        ctx.strokeStyle = gradient;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    });
  });

  ctx.setLineDash([]);
}

// Update HUD
function updateHUD() {
  hudFuel.textContent = fuel;
  hudCredits.textContent = credits;
  hudJob.textContent = currentJob
    ? `Travel to ${currentJob.targetPlanet.name} (${currentJob.reward} credits, ${currentJob.healthCost} health)`
    : 'None';
}

// Open the planet menu
function openMenu(planet) {
  planetNameElement.textContent = `Welcome to ${planet.name}`;
  actionsContainer.innerHTML = ''; // Clear old actions

  const fuelPrice = planet.name === 'Planet Prime' ? 2 : planet.distanceFromPrime + 1;
  const buyFuelButton = document.createElement('button');
  buyFuelButton.textContent = `Buy Fuel (${fuelPrice} credits/unit)`;
  buyFuelButton.onclick = () => buyFuel(fuelPrice);
  actionsContainer.appendChild(buyFuelButton);

  if (planet.missionObjective && (!currentJob || planet.name !== currentJob.targetPlanet.name)) {
    const missionButton = document.createElement('button');
    missionButton.textContent = `Take Mission: ${planet.missionObjective}`;
    missionButton.onclick = () => acceptMission(planet);
    actionsContainer.appendChild(missionButton);
  }

  if (currentJob && planet.name === currentJob.targetPlanet.name) {
    const completeJobButton = document.createElement('button');
    completeJobButton.textContent = 'Complete Job';
    completeJobButton.onclick = completeJob;
    actionsContainer.appendChild(completeJobButton);
  }

  const leaveButton = document.createElement('button');
  leaveButton.textContent = 'Leave';
  leaveButton.onclick = closeMenu;
  actionsContainer.appendChild(leaveButton);

  planetMenu.style.display = 'block';
}

// Close the planet menu
function closeMenu() {
  planetMenu.style.display = 'none';
}

// Accept a mission
function acceptMission(planet) {
  currentJob = {
    targetPlanet: planet,
    reward: 100 + planet.distanceFromPrime * 10,
    healthCost: planet.distanceFromPrime * 5,
  };
  updateHUD();
  closeMenu();
}

// Complete a job
function completeJob() {
  if (!currentJob) return;
  credits += currentJob.reward;
  health -= currentJob.healthCost;
  currentJob = null;
  updateHUD();
  alert('Job complete! You earned credits.');
  closeMenu();
}

// Buy fuel
function buyFuel(price) {
  if (credits < price) {
    alert('Not enough credits!');
    return;
  }
  credits -= price;
  fuel++;
  updateHUD();
}

// Handle ship movement and menu trigger
function moveShipTo(targetPlanet) {
  const dx = targetPlanet.x - (ship.x + ship.width / 2);
  const dy = targetPlanet.y - (ship.y + ship.height / 2);
  const distance = Math.sqrt(dx ** 2 + dy ** 2);
  const fuelCost = Math.ceil(distance / 50);

  if (fuel < fuelCost) {
    alert('Not enough fuel!');
    return;
  }

  fuel -= fuelCost;
  updateHUD();

  const steps = Math.ceil(distance / 5);
  const stepX = dx / steps;
  const stepY = dy / steps;

  let currentStep = 0;
  const interval = setInterval(() => {
    if (currentStep >= steps) {
      clearInterval(interval);
      ship.x = targetPlanet.x - ship.width / 2;
      ship.y = targetPlanet.y - ship.height / 2;

      openMenu(targetPlanet); // Automatically open menu upon arrival
    } else {
      ship.x += stepX;
      ship.y += stepY;
      currentStep++;
      draw();
    }
  }, 16);
}

// Handle clicks
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  planets.forEach((planet) => {
    const dx = offsetX - planet.x;
    const dy = offsetY - planet.y;
    if (Math.sqrt(dx ** 2 + dy ** 2) <= planet.radius) {
      moveShipTo(planet);
    }
  });
});

// Initialize the game
function initializeGame() {
  resizeCanvas();
  draw();
  updateHUD();
  openMenu(planets[0]); // Open Planet Prime menu on load
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initializeGame();
