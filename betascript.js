const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const planetMenu = document.getElementById('planetMenu');
const planetNameElement = document.getElementById('planetName');
const actionsContainer = document.getElementById('planetActions');

// Game state variables
const planets = [];
const ship = { x: 0, y: 0, width: 15, height: 10, color: '#ffffff' };
let currentJob = null;
let distressCallActive = false;
let distressCallPlanet = null;

// Resize canvas to fit container
function resizeCanvas() {
  const container = document.getElementById('mapContainer');
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  generatePlanets();
  draw();
}

// Initialize the game, opening Planet Prime menu
function initializeGame() {
  resizeCanvas();
  const primePlanet = planets.find((planet) => planet.name === 'Prime Planet');
  openMenu(primePlanet);
  draw();
}

// Generate planets
function generatePlanets() {
  planets.length = 0;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Add Prime Planet
  planets.push({ x: centerX, y: centerY, radius: 30, color: '#ff6600', name: 'Prime Planet' });

  // Add other planets
  for (let i = 0; i < 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * Math.min(canvas.width, canvas.height) * 0.3;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    planets.push({ x, y, radius: 20, color: ['#ffcc00', '#00bfff', '#ff3399'][i % 3], name: `Planet ${i + 1}` });
  }

  // Place the ship at Prime Planet
  ship.x = centerX - ship.width / 2;
  ship.y = centerY - ship.height / 2;
}

// Draw the game (planets, ship, mission indicators)
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw planet connections
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

  // Draw planets with labels
  planets.forEach((planet) => {
    // Glow effect
    const gradient = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.radius * 3);
    gradient.addColorStop(0, `${planet.color}33`);
    gradient.addColorStop(1, '#00000000');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius * 3, 0, Math.PI * 2);
    ctx.fill();

    // Planet border
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.strokeStyle = planet.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Planet label
    ctx.font = '12px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(planet.name, planet.x, planet.y - planet.radius - 5);
  });

  // Draw ship
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

// Draw arrows for active missions
function drawArrow(fromX, fromY, toX, toY, color) {
  const headLength = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  // Line
  ctx.setLineDash([]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Arrowhead
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

  // Job arrow
  if (currentJob) {
    drawArrow(shipCenterX, shipCenterY, currentJob.targetPlanet.x, currentJob.targetPlanet.y, '#00ff00');
  }

  // Distress call arrow
  if (distressCallActive) {
    drawArrow(shipCenterX, shipCenterY, distressCallPlanet.x, distressCallPlanet.y, '#ff0000');
  }
}

// Open planet menu
function openMenu(planet) {
  planetNameElement.textContent = `Welcome to ${planet.name}`;
  actionsContainer.innerHTML = ''; // Clear old actions

  // Add "Buy Fuel" button
  const buyFuelButton = document.createElement('button');
  buyFuelButton.textContent = 'Buy Fuel';
  buyFuelButton.onclick = buyFuel;
  actionsContainer.appendChild(buyFuelButton);

  // Planet Prime-specific actions
  if (planet.name === 'Prime Planet') {
    const selectJobButton = document.createElement('button');
    selectJobButton.textContent = 'Select Job';
    selectJobButton.onclick = selectJob;
    actionsContainer.appendChild(selectJobButton);

    const patchUpButton = document.createElement('button');
    patchUpButton.textContent = 'Patch Up';
    patchUpButton.onclick = patchUp;
    actionsContainer.appendChild(patchUpButton);
  }

  // Mission completion
  if (currentJob && planet.name === currentJob.targetPlanet.name) {
    const completeMissionButton = document.createElement('button');
    completeMissionButton.textContent = 'Complete Mission';
    completeMissionButton.onclick = completeMission;
    actionsContainer.appendChild(completeMissionButton);
  }

  if (distressCallActive && planet.name === distressCallPlanet.name) {
    const completeDistressButton = document.createElement('button');
    completeDistressButton.textContent = 'Complete Distress Mission';
    completeDistressButton.onclick = completeDistressMission;
    actionsContainer.appendChild(completeDistressButton);
  }

  planetMenu.style.display = 'block'; // Show menu
}

// Close planet menu
function closeMenu() {
  planetMenu.style.display = 'none';
}

// Buy fuel action
function buyFuel() {
  console.log('Fuel bought!');
}

// Patch up action
function patchUp() {
  console.log('Patched up health!');
}

// Select a job
function selectJob() {
  const availablePlanets = planets.filter((planet) => planet.name !== 'Prime Planet');
  currentJob = {
    targetPlanet: availablePlanets[Math.floor(Math.random() * availablePlanets.length)],
    reward: 100,
  };
  alert(`Job assigned! Travel to ${currentJob.targetPlanet.name}.`);
  closeMenu();
}

// Complete job mission
function completeMission() {
  alert(`Mission complete! You earned ${currentJob.reward} credits.`);
  currentJob = null;
  closeMenu();
}

// Trigger distress call
function triggerDistressCall() {
  const availablePlanets = planets.filter((planet) => planet.name !== 'Prime Planet');
  distressCallPlanet = availablePlanets[Math.floor(Math.random() * availablePlanets.length)];
  distressCallActive = true;
  alert(`Distress call received! Travel to ${distressCallPlanet.name}.`);
}

// Complete distress mission
function completeDistressMission() {
  alert('Distress mission complete! You earned 150 credits.');
  distressCallActive = false;
  distressCallPlanet = null;
  closeMenu();
}

// Click handling for planets
canvas.addEventListener('click', (event) => {
  const { offsetX, offsetY } = event;
  planets.forEach((planet) => {
    const dx = offsetX - planet.x;
    const dy = offsetY - planet.y;
    if (Math.sqrt(dx * dx + dy * dy) <= planet.radius) {
      openMenu(planet);
    }
  });
});

// Initialize game
resizeCanvas();
initializeGame();