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

// Draw retro line art
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
  hudJob.textContent = currentJob
    ? `Travel to ${currentJob.targetPlanet.name} (${currentJob.reward} credits, ${currentJob.healthCost} health)`
    : 'None';
}

// Open the planet menu
function openMenu(planet) {
  planetNameElement.textContent = `Welcome to ${planet.name}`;
  actionsContainer.innerHTML = '';

  // Buy fuel
  const fuelPrice = planet.name === 'Prime Planet' ? 2 : planet.distanceFromPrime + 1;
  const buyFuelButton = document.createElement('button');
  buyFuelButton.textContent = `Buy Fuel (${fuelPrice} credits/unit)`;
  buyFuelButton.onclick = () => buyFuel(fuelPrice);
  actionsContainer.appendChild(buyFuelButton);

  // Planet Prime actions
  if (planet.name === 'Prime Planet') {
    const chooseJobButton = document.createElement('button');
    chooseJobButton.textContent = 'Choose Job';
    chooseJobButton.onclick = chooseJob;
    actionsContainer.appendChild(chooseJobButton);

    const patchUpButton = document.createElement('button');
    patchUpButton.textContent = 'Patch Up (10 credits/health)';
    patchUpButton.onclick = patchUp;
    actionsContainer.appendChild(patchUpButton);
  }

  // Job completion
  if (currentJob && planet.name === currentJob.targetPlanet.name) {
    const completeJobButton = document.createElement('button');
    completeJobButton.textContent = 'Complete Job';
    completeJobButton.onclick = completeJob;
    actionsContainer.appendChild(completeJobButton);
  }

  // Leave button
  const leaveButton = document.createElement('button');
  leaveButton.textContent = 'Leave';
  leaveButton.onclick = closeMenu;
  actionsContainer.appendChild(leaveButton);

  planetMenu.style.display = 'block';
}

// Close menu
function closeMenu() {
  planetMenu.style.display = 'none';
}

// Buy fuel
function buyFuel(pricePerUnit) {
  const unitsToBuy = Math.min(10, Math.floor(credits / pricePerUnit));
  if (unitsToBuy > 0) {
    fuel += unitsToBuy;
    credits -= unitsToBuy * pricePerUnit;
    showMenuMessage(`Bought ${unitsToBuy} fuel for ${unitsToBuy * pricePerUnit} credits.`);
    updateHUD();
  } else {
    showMenuMessage('Not enough credits!');
  }
}

// Patch up health
function patchUp() {
  const maxHeal = Math.min(10, Math.floor(credits / 10));
  if (maxHeal > 0) {
    health += maxHeal;
    credits -= maxHeal * 10;
    showMenuMessage(`Patched up ${maxHeal} health for ${maxHeal * 10} credits.`);
    updateHUD();
  } else {
    showMenuMessage('Not enough credits!');
  }
}

// Choose job
function chooseJob() {
  actionsContainer.innerHTML = ''; // Clear menu
  showMenuMessage('Choose a job:');

  planets
    .filter((planet) => planet.name !== 'Prime Planet')
    .forEach((planet) => {
      const healthCost = Math.ceil(planet.distanceFromPrime / 2);
      const reward = planet.distanceFromPrime * 10 + healthCost * 10;

      const jobButton = document.createElement('button');
      jobButton.textContent = `Travel to ${planet.name} (${reward} credits, ${healthCost} health)`;
      jobButton.onclick = () => {
        currentJob = { targetPlanet: planet, reward, healthCost };
        showMenuMessage(`Job accepted: Travel to ${planet.name}.`);
        updateHUD();
      };
      actionsContainer.appendChild(jobButton);
    });

  // Back button
  const backButton = document.createElement('button');
  backButton.textContent = 'Back';
  backButton.onclick = () => openMenu(planets[0]);
  actionsContainer.appendChild(backButton);
}

// Complete job
function completeJob() {
  if (health >= currentJob.healthCost) {
    health -= currentJob.healthCost;
    credits += currentJob.reward;
    showMenuMessage(`Job complete: ${currentJob.reward} credits earned, ${currentJob.healthCost} health lost.`);
    currentJob = null;
    updateHUD();
  } else {
    showMenuMessage('Not enough health to complete the job!');
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
  openMenu(planets[0]);
  updateHUD();
}

// Handle clicks
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

function moveShipTo(targetPlanet) {
  const dx = targetPlanet.x - (ship.x + ship.width / 2);
  const dy = targetPlanet.y - (ship.y + ship.height / 2);
  const distance = Math.sqrt(dx ** 2 + dy ** 2);
  const fuelCost = Math.ceil(distance / 50);

  if (fuel < fuelCost) {
    showMenuMessage('Not enough fuel!');
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

// Start game
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initializeGame();
