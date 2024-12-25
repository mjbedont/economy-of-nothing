// Canvas Setup
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// Game State
const planets = [];
const ship = { x: 0, y: 0, width: 15, height: 10, color: '#ffffff' };
let fuel = 50;
let health = 100;
let credits = 500;
let promotions = 0;
let dispatches = 0;
let followers = 0;
let visitedPlanets = [];
let currentJob = null;

// HUD Elements
const hudFuel = document.getElementById('fuel');
const hudHealth = document.getElementById('health');
const hudCredits = document.getElementById('credits');
const hudJob = document.getElementById('job');
const hudPromotions = document.getElementById('promotions');
const hudDispatches = document.getElementById('dispatches');
const hudFollowers = document.getElementById('followers');
const hudPlanetsVisited = document.getElementById('planetsVisited');
const hudPOD = document.getElementById('pod');

// Message Box
const messageBox = document.getElementById('messageBox');

// Initialize Canvas
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    generatePlanets();
    draw();
}

window.addEventListener('resize', resizeCanvas);

// Generate Planets
function generatePlanets() {
    planets.length = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Planet Prime
    planets.push({
        x: centerX,
        y: centerY,
        radius: 30,
        color: '#ff6600',
        name: 'Planet Prime',
        distance: 0,
    });

    // Additional Planets
    for (let i = 1; i <= 7; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 200;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        planets.push({
            x,
            y,
            radius: 20,
            color: ['#00bfff', '#ff3399', '#ffcc00'][i % 3],
            name: `Planet ${i}`,
            distance: Math.round(distance / 50),
        });
    }
}

// HUD Updates
function updateHUD() {
    hudFuel.textContent = `FUEL: ${fuel}`;
    hudHealth.textContent = `HEALTH: ${health}`;
    hudCredits.textContent = `CREDITS: ${credits}`;
    hudJob.textContent = currentJob ? `JOB: Travel to ${currentJob.targetPlanet.name}` : 'JOB: NONE';
    hudPromotions.textContent = `PROMOTIONS: ${promotions}`;
    hudDispatches.textContent = `DISPATCHES: ${dispatches}`;
    hudFollowers.textContent = `FOLLOWERS: ${followers}`;
    hudPlanetsVisited.textContent = `PLANETS VISITED: ${visitedPlanets.length}`;
    hudPOD.textContent = `POD: ${dispatches > 0 ? (promotions / dispatches).toFixed(2) : 'N/A'}`;
}

// Draw Planets and Ship
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Planets
    planets.forEach((planet) => {
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.fillStyle = planet.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        // Planet Label
        ctx.font = '12px Orbitron';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, planet.x, planet.y - planet.radius - 5);
    });

    // Draw Ship
    ctx.fillStyle = ship.color;
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// Initialize Game
function initializeGame() {
    resizeCanvas();
    updateHUD();
    showMessage('Welcome to Galaxy Explorer!', 'success');
}

initializeGame();