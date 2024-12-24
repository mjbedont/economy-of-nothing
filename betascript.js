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

// Resize canvas and regenerate planets only if they don't exist
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

  // Padding to ensure planets remain fully visible
  const padding = 50;

  // Add Prime Planet
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
    do {
      const angle = Math.random() * Math.PI * 2;
      const distance = 100 + Math.random() * (Math.min(canvas.width, canvas.height) * 0.4);
      x = centerX + Math.cos(angle) * distance;
      y = centerY + Math.sin(angle) * distance;

      // Clamp within the canvas boundaries with padding
      x = Math.max(padding, Math.min(canvas.width - padding, x));
      y = Math.max(padding, Math.min(canvas.height - padding, y));
    } while (
      planets.some(
        (p) => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 70 // Avoid overlap
      )
    );

    planets.push({
      x,
      y,
      radius: 20,
      color: ['#ffcc00', '#00bfff', '#ff3399'][i % 3],
      name: `Planet ${i + 1}`,
      distanceFromPrime: Math.round(Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) / 50), // Relative distance
    });
  }

  // Position ship on Prime Planet
  const primePlanet = planets[0];
  ship.x = primePlanet.x - ship.width / 2;
  ship.y = primePlanet.y - ship.height / 2;
}

// Draw the game
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
  const fuelPrice = planet.distanceFromPrime ? planet.distanceFromPrime + 1 : 2;
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

// Buy fuel action
function buyFuel(planet, fuelPrice) {
  const unitsToBuy = Math.min(10, Math.floor(credits / fuelPrice));
  if (unitsToBuy > 0) {
    fuel += unitsToBuy;
    credits -= unitsToBuy * fuelPrice;
    showMenuMessage(`Bought ${unitsToBuy} fuel for ${unitsToBuy * fuelPrice} credits.`);
    updateHUD();
  } else {
    showMenuMessage('Not enough credits to buy fuel!');
  }
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

// Select a job
function selectJob() {
  const availablePlanets = planets.filter((planet) => planet.name !== 'Prime Planet');
  currentJob = {
    targetPlanet: availablePlanets[Math.floor(Math.random() * availablePlanets.length)],
    reward: 100,
  };
  showMenuMessage(`Job assigned! Travel to ${currentJob.targetPlanet.name}.`);
  updateHUD();
}

// Complete job mission
function completeMission() {
  showMenuMessage(`Mission complete! You earned ${currentJob.reward} credits.`);
  credits += currentJob.reward;
  currentJob = null;
  updateHUD();
}

// Initialize the game
function initializeGame() {
  resizeCanvas();
  const primePlanet = planets[0];
  ship.x = primePlanet.x - ship.width / 2;
  ship.y = primePlanet.y - ship.height / 2;

  // Start the game with the Prime Planet menu open
  openMenu(primePlanet);
  updateHUD();
}

// Handle planet clicks
canvas.addEventListener('click', (event) => {
  const { offsetX, offsetY } = event;
  planets.forEach((planet) => {
    const dx = offsetX - planet.x;
    const dy = offsetY - planet.y;
    if (Math.sqrt(dx ** 2 + dy ** 2) <= planet.radius) {
      moveShipTo(planet);
    }
  });
});

// Initialize the game
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initializeGame();
