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
let promotions = 0; // Promotions count
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
    name: 'Prime Planet',
    distanceFromPrime: 0,
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

// Draw retro line art between planets
function drawLineArt() {
  ctx.setLineDash([5, 15]); // Dashed lines
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

  ctx.setLineDash([]); // Reset line dash
}

// Update HUD
function updateHUD() {
  hudFuel.textContent = fuel;
  hudCredits.textContent = credits;
  hudMission.textContent = currentJob ? currentJob.targetPlanet.name : 'None';
}

// Ship movement animation
function moveShipTo(targetPlanet) {
  const dx = targetPlanet.x - (ship.x + ship.width / 2);
  const dy = targetPlanet.y - (ship.y + ship.height / 2);
  const distance = Math.sqrt(dx ** 2 + dy ** 2);
  const fuelCost = Math.ceil(distance / 50);

  if (fuel < fuelCost) {
    showMenuMessage('Not enough fuel to travel!');
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

      openMenu(targetPlanet);
    } else {
      ship.x += stepX;
      ship.y += stepY;
      currentStep++;
      draw();
    }
  }, 16);
}

// Open the planet menu
function openMenu(planet) {
  planetNameElement.textContent = `Welcome to ${planet.name}`;
  actionsContainer.innerHTML = '';

  const fuelPrice = planet.distanceFromPrime ? planet.distanceFromPrime + 1 : 2;
  const buyFuelButton = document.createElement('button');
  buyFuelButton.textContent = `Buy Fuel (${fuelPrice} credits/unit)`;
  buyFuelButton.onclick = () => buyFuel(planet, fuelPrice);
  actionsContainer.appendChild(buyFuelButton);

  if (planet.name === 'Prime Planet') {
    const selectJobButton = document.createElement('button');
    selectJobButton.textContent = 'Select Job';
    selectJobButton.onclick = selectJob;
    actionsContainer.appendChild(selectJobButton);

    const buyPromotionButton = document.createElement('button');
    buyPromotionButton.textContent = 'Buy Promotion (100 credits)';
    buyPromotionButton.onclick = buyPromotion;
    actionsContainer.appendChild(buyPromotionButton);
  }

  if (currentJob && planet.name === currentJob.targetPlanet.name) {
    const completeMissionButton = document.createElement('button');
    completeMissionButton.textContent = 'Complete Mission';
    completeMissionButton.onclick = completeMission;
    actionsContainer.appendChild(completeMissionButton);
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

// Show menu message
function showMenuMessage(message) {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.style.color = '#ffffff';
  const oldMessages = actionsContainer.querySelectorAll('p');
  oldMessages.forEach((msg) => msg.remove());
  actionsContainer.prepend(messageElement);
}

// Initialize the game
function initializeGame() {
  resizeCanvas();
  const primePlanet = planets[0];
  ship.x = primePlanet.x - ship.width / 2;
  ship.y = primePlanet.y - ship.height / 2;

  openMenu(primePlanet);
  updateHUD();
}

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

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initializeGame();

