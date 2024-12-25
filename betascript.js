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
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (planets.length === 0) generatePlanets();
    draw();
}

// Generate planets
function generatePlanets() {
    planets.length = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    planets.push({
        x: centerX,
        y: centerY,
        radius: 30,
        color: '#ff6600',
        name: 'Planet Prime',
        distanceFromPrime: 0,
    });

    for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * (Math.min(canvas.width, canvas.height) * 0.4);
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        planets.push({
            x,
            y,
            radius: 20,
            color: ['#ffcc00', '#00bfff', '#ff3399'][i % 3],
            name: `Planet ${i + 1}`,
            distanceFromPrime: Math.round(distance / 50),
        });
    }

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
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = '12px monospace';
        ctx.fillText(planet.name, planet.x, planet.y - planet.radius - 5);
    });

    ctx.fillStyle = ship.color;
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// Update HUD
function updateHUD() {
    hudFuel.textContent = fuel;
    hudCredits.textContent = credits;
    hudJob.textContent = currentJob ? `Travel to ${currentJob.targetPlanet.name}` : 'None';
}

// Open planet menu
function openMenu(planet) {
    planetNameElement.textContent = `Welcome to ${planet.name}`;
    actionsContainer.innerHTML = '';

    // Buy fuel
    const fuelPrice = planet.name === 'Planet Prime' ? 2 : planet.distanceFromPrime + 1;
    const buyFuelButton = document.createElement('button');
    buyFuelButton.textContent = `Buy Fuel (${fuelPrice} credits/unit)`;
    buyFuelButton.onclick = () => buyFuel(fuelPrice);
    actionsContainer.appendChild(buyFuelButton);

    // Planet Prime specific actions
    if (planet.name === 'Planet Prime') {
        const chooseJobButton = document.createElement('button');
        chooseJobButton.textContent = 'Choose Job';
        chooseJobButton.onclick = chooseJob;
        actionsContainer.appendChild(chooseJobButton);

        const repairButton = document.createElement('button');
        repairButton.textContent = 'Repair Ship (10 credits/unit)';
        repairButton.onclick = repairShip;
        actionsContainer.appendChild(repairButton);
    }

    // Complete job
    if (currentJob && planet.name === currentJob.targetPlanet.name) {
        const completeJobButton = document.createElement('button');
        completeJobButton.textContent = 'Complete Job';
        completeJobButton.onclick = completeJob;
        actionsContainer.appendChild(completeJobButton);
    }

    // Leave menu
    const leaveButton = document.createElement('button');
    leaveButton.textContent = 'Leave';
    leaveButton.onclick = closeMenu;
    actionsContainer.appendChild(leaveButton);

    planetMenu.classList.remove('hidden');
}

// Close menu
function closeMenu() {
    planetMenu.classList.add('hidden');
}

// Buy fuel
function buyFuel(pricePerUnit) {
    const unitsToBuy = Math.min(10, Math.floor(credits / pricePerUnit));
    if (unitsToBuy > 0) {
        fuel += unitsToBuy;
        credits -= unitsToBuy * pricePerUnit;
        alert(`Bought ${unitsToBuy} fuel for ${unitsToBuy * pricePerUnit} credits.`);
        updateHUD();
    } else {
        alert('Not enough credits!');
    }
}

// Repair ship
function repairShip() {
    const maxRepair = Math.min(10, Math.floor(credits / 10));
    if (maxRepair > 0) {
        health += maxRepair;
        credits -= maxRepair * 10;
        alert(`Repaired ${maxRepair} health for ${maxRepair * 10} credits.`);
        updateHUD();
    } else {
        alert('Not enough credits!');
    }
}

// Choose job
function chooseJob() {
    actionsContainer.innerHTML = '';
    planets
        .filter((planet) => planet.name !== 'Planet Prime')
        .forEach((planet) => {
            const jobButton = document.createElement('button');
            jobButton.textContent = `Travel to ${planet.name}`;
            jobButton.onclick = () => {
                currentJob = { targetPlanet: planet, reward: planet.distanceFromPrime * 50 };
                alert(`Job accepted: Travel to ${planet.name}`);
                updateHUD();
                closeMenu();
            };
            actionsContainer.appendChild(jobButton);
        });

    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = () => openMenu(planets[0]);
    actionsContainer.appendChild(backButton);
}

// Complete job
function completeJob() {
    credits += currentJob.reward;
    alert(`Job completed! Earned ${currentJob.reward} credits.`);
    currentJob = null;
    updateHUD();
}

// Ship movement
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
    const dx = targetPlanet.x - ship.x;
    const dy = targetPlanet.y - ship.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);
    const fuelCost = Math.ceil(distance / 50);

    if (fuel < fuelCost) {
        alert('Not enough fuel!');
        return;
    }

    fuel -= fuelCost;
    ship.x = targetPlanet.x - ship.width / 2;
    ship.y = targetPlanet.y - ship.height / 2;
    draw();
    openMenu(targetPlanet);
}

// Initialize game
function initializeGame() {
    resizeCanvas();
    updateHUD();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
initializeGame();