// Ensure this is linked as `betascript.js` in your HTML
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

// Generate planets
function generatePlanets() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  planets.push({
    x: centerX,
    y: centerY,
    radius: 30,
    color: '#ff6600',
    name: 'Planet Prime',
    distanceFromPrime: 0,
    missionObjective: null,
  });

  for (let i = 1; i <= 5; i++) {
    const angle = (i * 72) * (Math.PI / 180); // Distribute evenly around center
    const distance = 200;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    planets.push({
      x,
      y,
      radius: 20,
      color: ['#ffcc00', '#00bfff', '#ff3399'][i % 3],
      name: `Planet ${i}`,
      distanceFromPrime: i * 2,
      missionObjective: `Mission ${i}: Do Task`,
    });
  }
}

// Draw planets and ship
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  planets.forEach((planet) => {
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(planet.name, planet.x, planet.y - planet.radius - 5);
  });

  ctx.fillStyle = ship.color;
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// Open planet menu
function openMenu(planet) {
  planetNameElement.textContent = `Welcome to ${planet.name}`;
  actionsContainer.innerHTML = '';

  const fuelPrice = planet.name === 'Planet Prime' ? 2 : planet.distanceFromPrime + 1;

  const buyFuelButton = document.createElement('button');
  buyFuelButton.textContent = `Buy Fuel (${fuelPrice} credits/unit)`;
  buyFuelButton.onclick = () => {
    if (credits >= fuelPrice) {
      credits -= fuelPrice;
      fuel++;
      updateHUD();
    } else {
      alert('Not enough credits!');
    }
  };
  actionsContainer.appendChild(buyFuelButton);

  const leaveButton = document.createElement('button');
  leaveButton.textContent = 'Leave';
  leaveButton.onclick = () => (planetMenu.style.display = 'none');
  actionsContainer.appendChild(leaveButton);

  planetMenu.style.display = 'block';
}

// Update HUD
function updateHUD() {
  hudFuel.textContent = `Fuel: ${fuel}`;
  hudCredits.textContent = `Credits: ${credits}`;
  hudJob.textContent = `Job: ${currentJob || 'None'}`;
}

// Initialization
function initializeGame() {
  generatePlanets();
  ship.x = planets[0].x - ship.width / 2;
  ship.y = planets[0].y - ship.height / 2;
  draw();
  updateHUD();
  openMenu(planets[0]); // Start with Planet Prime menu open
}

initializeGame();
