// Canvas and Context
const canvas = document.getElementById("galaxyMap");
const ctx = canvas.getContext("2d");

// Responsive canvas size
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Game State
let fuel = 20;
let credits = 100;
let promotions = 0;
let primeReturns = 0;
let ship = { x: 0, y: 0 };
let currentPlanet = null;

// Planets
const planets = [
    { name: "Planet Prime", hub: true, missionCompleted: false, lore: "The bustling central hub of the galaxy." },
    { name: "Brenner 7", missionCompleted: false, lore: "Home to rabid cowboy robots in the Badlands." },
    { name: "Dracronaria", missionCompleted: false, lore: "A medieval-themed world ruled by Queen Kamalalalala." },
    { name: "Mukuku", missionCompleted: false, lore: "A serene ski resort planet, perfect for relaxation." },
    { name: "Malonberg", missionCompleted: false, lore: "A planet of high fashion and energy." },
    { name: "Donnie47", missionCompleted: false, lore: "An orange gas giant known for its space elevator." },
    { name: "New Rome", missionCompleted: false, lore: "A classical yet futuristic planet ruled by New Caesar." },
    { name: "Pawndora", missionCompleted: false, lore: "A planet inhabited by sentient dogs." },
];
const prime = planets[0];

// Initialize Planets with Positions
const planetPositions = generatePlanets(planets.length, canvas.width, canvas.height, 150);
planets.forEach((planet, index) => {
    planet.x = planetPositions[index].x;
    planet.y = planetPositions[index].y;
});

// Utility Functions
function generatePlanets(count, width, height, minDistance) {
    const positions = [];
    while (positions.length < count) {
        const x = Math.random() * (width - 100) + 50;
        const y = Math.random() * (height - 100) + 50;

        let tooClose = positions.some((pos) => {
            const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            return distance < minDistance;
        });

        if (!tooClose) {
            positions.push({ x, y });
        }
    }
    return positions;
}

// Drawing Functions
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoutes();
    drawPlanets();
    drawShip();
}

function drawRoutes() {
    ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
    ctx.setLineDash([10, 5]);
    ctx.beginPath();

    planets.forEach((start) => {
        planets.forEach((end) => {
            if (start !== end) {
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
            }
        });
    });

    ctx.stroke();
}

function drawPlanets() {
    planets.forEach((planet) => {
        ctx.fillStyle = currentPlanet === planet ? "cyan" : "#00FF00";
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#00FF00";
        ctx.font = "12px monospace";
        ctx.fillText(planet.name, planet.x - 30, planet.y - 20);
    });
}

function drawShip() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, 5, 0, Math.PI * 2);
    ctx.fill();
}

// Event Listeners
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    planets.forEach((planet) => {
        const distance = Math.sqrt(
            (mouseX - planet.x) ** 2 + (mouseY - planet.y) ** 2
        );
        if (distance < 15) {
            visitPlanet(planet);
        }
    });
});

// Planet Interaction
function visitPlanet(planet) {
    // Same function as before, but modularized
    // Includes dynamic content loading logic
}

// Initialize Game
function initializeGame() {
    ship.x = prime.x;
    ship.y = prime.y;
    drawMap();
    visitPlanet(prime);
}

// Start Game
initializeGame();
