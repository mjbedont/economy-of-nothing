const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const planetMenu = document.getElementById('planetMenu');
const planetNameElement = document.getElementById('planetName');
const actionsContainer = document.getElementById('planetActions');

// HUD elements
const hudFuel = document.getElementById('fuel');
const hudCredits = document.getElementById('credits');
const hudMission = document.getElementById('mission');

// Game state variables
const planets = [];
const ship = { x: 0, y: 0, width: 15, height: 10, color: '#ffffff' };
let fuel = 50;
let credits = 500;
let currentJob = null;

// Resize canvas to match the container
function resizeCanvas() {
  const container = document.getElementById('mapContainer');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  generatePlanets();
  draw();
}

// Generate planets within the visible bounds of the canvas
function generatePlanets() {
  planets.length = 0;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Add Prime Planet in the center
  planets.push({
    x: centerX,
    y: centerY,
    radius: 30,
    color: '#ff6600',
    name: 'Prime Planet',
    distanceFromPrime: 0,
  });

  // Add other planets
  for (let i = 0; i < 5; i++) {
    let x, y;
    const padding = 50; // Minimum distance from canvas edges
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * (Math.min(canvas.width, canvas.height) * 0.4);

    // Calculate position within bounds
    do {
      x = centerX + Math.cos(angle) * distance;
      y = centerY + Math.sin(angle) * distance;

      // Clamp values to keep planets inside the canvas
      x = Math.max(padding, Math.min(canvas.width - padding, x));
      y = Math.max(padding, Math.min(canvas.height - padding, y));
    } while (
      planets.some(
        (p) => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 60
      )
    ); // Avoid overlapping planets

    planets.push({
      x,
      y,
      radius: 20,
      color: ['#ffcc00', '#00bfff', '#ff3399'][i % 3],
      name: `Planet ${i + 1}`,
      distanceFromPrime: Math.round(distance / 50), // Relative distance
    });
  }
}

// Redraw planets and ship within the bounds
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

// Update HUD
function updateHUD() {
  hudFuel.textContent = fuel;
  hudCredits.textContent = credits;
  hudMission.textContent = currentJob ? currentJob.targetPlanet.name : 'None';
}

// Open the planet menu
function openMenu(planet) {
  planetNameElement.textContent = `Welcome to ${planet.name}`;
  actionsContainer.innerHTML = ''; // Clear old actions

  // Add "Buy Fuel" button
  const fuelPrice = planet.distanceFromPrime ? planet.distanceFromPrime + 1 : 2; // Prime Planet: 2, others: relative to distance
  const buyFuelButton = document.createElement('button');
  buyFuelButton.textContent = `Buy Fuel (${fuelPrice} credits/unit)`;
  buyFuelButton.onclick = () => buyFuel(planet, fuelPrice);
  actionsContainer.appendChild(buyFuelButton);

  // Planet Prime-specific actions
  if (planet.name === 'Prime Planet') {
    const selectJobButton = document.createElement('button');
    selectJobButton.textContent = 'Select Job';
    selectJobButton.onclick = selectJob;
    actionsContainer.appendChild(selectJobButton);
  }

  // Mission completion
  if (currentJob && planet.name === currentJob.targetPlanet.name) {
    const completeMissionButton = document.createElement('button');
    completeMissionButton.textContent = 'Complete Mission';
    completeMissionButton.onclick = completeMission;
    actionsContainer.appendChild(completeMissionButton);
  }

  // Add leave button
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

// Show a single message in the menu
function showMenuMessage(message) {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.style.color = '#ffffff';

  // Clear existing messages and add the new one
  const oldMessages = actionsContainer.querySelectorAll('p');
  oldMessages.forEach((msg) => msg.remove());
  actionsContainer.prepend(messageElement);
}

// Initialize the game, opening Planet Prime menu on start
function initializeGame() {
  resizeCanvas(); // Ensure the canvas is correctly sized
  const primePlanet = planets.find((planet) => planet.name === 'Prime Planet');
  if (primePlanet) {
    ship.x = primePlanet.x - ship.width / 2; // Position the ship on Prime Planet
    ship.y = primePlanet.y - ship.height / 2;
    openMenu(primePlanet); // Open the menu for Planet Prime
  }
  updateHUD(); // Update the HUD to reflect initial stats
  draw(); // Draw the initial game state
}

// Handle planet clicks
canvas.addEventListener('click', (event) => {
  const { offsetX, offsetY } = event;
  planets.forEach((planet) => {
    const dx = offsetX - planet.x;
    const dy = offsetY - planet.y;
    if (Math.sqrt(dx * dx + dy * dy) <= planet.radius) {
      moveShipTo(planet);
    }
  });
});

// Initialize the game
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initializeGame();
