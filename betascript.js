// DOM Elements
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const messageBox = document.getElementById("messageBox");
const hudFuel = document.getElementById("fuel");
const hudHealth = document.getElementById("health");
const hudCredits = document.getElementById("credits");
const hudJob = document.getElementById("job");
const hudPromotions = document.getElementById("promotions");
const hudDispatches = document.getElementById("dispatches");
const hudFollowers = document.getElementById("followers");
const hudPlanetsVisited = document.getElementById("planetsVisited");
const hudPOD = document.getElementById("pod");

// Game State Variables
const planets = [];
const ship = { x: 0, y: 0, width: 15, height: 10, color: "#ffffff" };
let fuel = 50;
let health = 100;
let credits = 500;
let promotions = 0;
let dispatches = 0;
let followers = 0;
let visitedPlanets = [];
let currentJob = null;

// Initialize Canvas Size
function resizeCanvas() {
  const container = document.getElementById("mapContainer");
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  if (planets.length === 0) {
    generatePlanets();
  }
  draw();
}
window.addEventListener("resize", resizeCanvas);

// Generate Planets
function generatePlanets() {
  planets.length = 0;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const padding = 50;

  // Add Planet Prime
  planets.push({
    x: centerX,
    y: centerY,
    radius: 30,
    color: "#ff6600",
    name: "Planet Prime",
    distanceFromPrime: 0,
  });

  // Add other planets
  for (let i = 1; i <= 7; i++) {
    let x, y;
    do {
      const angle = Math.random() * Math.PI * 2;
      const distance = 150 + Math.random() * 200;
      x = centerX + Math.cos(angle) * distance;
      y = centerY + Math.sin(angle) * distance;
    } while (
      planets.some(
        (p) => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 80
      )
    );

    planets.push({
      x,
      y,
      radius: 20,
      color: ["#00bfff", "#ff3399", "#ffcc00"][i % 3],
      name: `Planet ${i}`,
      distanceFromPrime: Math.round(
        Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) / 50
      ),
    });
  }

  // Place the ship on Planet Prime
  const primePlanet = planets[0];
  ship.x = primePlanet.x - ship.width / 2;
  ship.y = primePlanet.y - ship.height / 2;
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
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    // Label Planets
    ctx.font = "12px Orbitron";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(planet.name, planet.x, planet.y - planet.radius - 5);
  });

  // Draw Ship
  ctx.fillStyle = ship.color;
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// Update HUD
function updateHUD() {
  hudFuel.textContent = `Fuel: ${fuel}`;
  hudHealth.textContent = `Health: ${health}`;
  hudCredits.textContent = `Credits: ${credits}`;
  hudJob.textContent = currentJob
    ? `Job: Travel to ${currentJob.targetPlanet.name}`
    : "Job: None";
  hudPromotions.textContent = `Promotions: ${promotions}`;
  hudDispatches.textContent = `Dispatches: ${dispatches}`;
  hudFollowers.textContent = `Followers: ${followers}`;
  hudPlanetsVisited.textContent = `Planets Visited: ${visitedPlanets.length}`;
  hudPOD.textContent = `POD: ${
    dispatches > 0 ? (promotions / dispatches).toFixed(2) : "N/A"
  }`;
}

// Messages
function showMessage(message, type = "info") {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;

  // Styling based on type
  switch (type) {
    case "success":
      messageElement.style.color = "#00ff00";
      break;
    case "warning":
      messageElement.style.color = "#ffff00";
      break;
    case "error":
      messageElement.style.color = "#ff0000";
      break;
    default:
      messageElement.style.color = "#ffffff";
  }

  messageBox.appendChild(messageElement);

  // Auto-remove message after 5 seconds
  setTimeout(() => {
    messageElement.remove();
  }, 5000);
}

// Job System
function generateJobs() {
  const jobs = [];
  const risks = ["low", "medium", "high"];

  risks.forEach((risk, index) => {
    const targetPlanet = planets[index + 1]; // Exclude Planet Prime
    const healthLoss = calculateHealthLoss(risk);
    const payout = getJobPayout(targetPlanet, risk);

    jobs.push({
      risk,
      targetPlanet,
      healthLoss,
      payout,
    });
  });

  return jobs;
}

function calculateHealthLoss(risk) {
  const ranges = {
    low: [5, 15],
    medium: [20, 35],
    high: [40, 70],
  };
  const range = ranges[risk];
  return Math.ceil(
    (Math.random() * (range[1] - range[0]) + range[0] / 100) * health
  );
}

function getJobPayout(planet, risk) {
  const basePayout = planet.distanceFromPrime * 50;
  const riskMultiplier = {
    low: 1,
    medium: 1.5,
    high: 2,
  };
  return Math.round(basePayout * riskMultiplier[risk]);
}

// Initialize Game
function initializeGame() {
  resizeCanvas();
  updateHUD();
  showMessage("Welcome to Galaxy Explorer!", "success");
}

initializeGame();