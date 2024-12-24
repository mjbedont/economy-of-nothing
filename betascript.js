const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const planetMenu = document.getElementById('planetMenu');
const planetNameElement = document.getElementById('planetName');
const actionsContainer = document.getElementById('planetActions');

// Game state variables
const planets = [];
const ship = { x: 0, y: 0, width: 15, height: 10, color: '#ffffff' };
let fuel = 50;
let credits = 500;
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
  planets.push({ x: centerX, y: centerY, radius: 30, color: '#ff6600', name: 'Prime Planet', distanceFromPrime: 0 });

  // Add other planets
  for (let i = 0; i < 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * Math.min(canvas.width, canvas.height) * 0.3;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    const distanceFromPrime = Math.round(distance / 50); // Arbitrary scaling factor for simplicity
    planets.push({
      x,
      y,
      radius: 20,
      color: ['#ffcc00', '#00bfff', '#ff3399'][i % 3],
      name: `Planet ${i + 1}`,
      distanceFromPrime,
    });
  }

  // Place the ship at Prime Planet
  ship.x = centerX - ship.width / 2;
  ship.y = centerY - ship.height / 2;
}

// Draw the game (planets, ship)
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw planets
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

  // Draw ship
  ctx.fillStyle = ship.color;
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// Calculate fuel cost based on distance
function calculateFuelCost(fromPlanet, toPlanet) {
  const dx = fromPlanet.x - toPlanet.x;
  const dy = fromPlanet.y - toPlanet.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return Math.ceil(distance / 50); // Arbitrary scaling factor for fuel usage
}

// Move ship animation
function moveShipTo(targetPlanet) {
  const primePlanet = planets.find((planet) => planet.name === 'Prime Planet');
  const fuelCost = calculateFuelCost(
    planets.find((planet) => planet.x === ship.x + ship.width / 2 && planet.y === ship.y + ship.height / 2),
    targetPlanet
  );

  if (fuel < fuelCost) {
    showMenuMessage('Not enough fuel to travel!', 'error');
    return;
  }

  fuel -= fuelCost;
  updateHUD();

  const dx = targetPlanet.x - (ship.x + ship.width / 2);
  const dy = targetPlanet.y - (ship.y + ship.height / 2);
  const steps = 60;
  const stepX = dx / steps;
  const stepY = dy / steps;

  let currentStep = 0;
  const interval = setInterval(() => {
    if (currentStep >= steps) {
      clearInterval(interval);
      ship.x = targetPlanet.x - ship.width / 2;
      ship.y = targetPlanet.y - ship.height / 2;
      openMenu(targetPlanet);
    } else {
      ship.x += stepX;
      ship.y += stepY;
      currentStep++;
      draw();
    }
  }, 16);
}

// Update the HUD
function updateHUD() {
  document.getElementById('fuel').textContent = fuel;
  document.getElementById('credits').textContent = credits;
}

// Open planet menu
function openMenu(planet) {
  planetNameElement.textContent = `Welcome to ${planet.name}`;
  actionsContainer.innerHTML = ''; // Clear old actions

  // Add "Buy Fuel" button
  const fuelPrice = planet.name === 'Prime Planet' ? 2 : planet.distanceFromPrime * 2;
  const buyFuelButton = document.createElement('button');
  buyFuelButton.textContent = `Buy Fuel (${fuelPrice} credits/unit)`;
  buyFuelButton.onclick = () => buyFuel(fuelPrice);
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

  // Leave button
  const leaveButton = document.createElement('button');
  leaveButton.textContent = 'Leave';
  leaveButton.onclick = closeMenu;
  actionsContainer.appendChild(leaveButton);

  planetMenu.style.display = 'block';
}

// Show messages inside the planet menu
function showMenuMessage(message,