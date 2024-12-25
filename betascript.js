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

const menuBox = document.getElementById("menuBox");

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
  const padding = 60; // Keep planets within the visible canvas

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
      const distance = 150 + Math.random() * (Math.min(canvas.width, canvas.height) * 0.4);
      x = centerX + Math.cos(angle) * distance;
      y = centerY + Math.sin(angle) * distance;
      x = Math.max(padding, Math.min(canvas.width - padding, x));
      y = Math.max(padding, Math.min(canvas.height - padding, y));
    } while (
      planets.some(
        (p) => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 100
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

// Planet Interaction
canvas.addEventListener("click", (event) => {
  const { offsetX, offsetY } = event;
  planets.forEach((planet) => {
    const dx = offsetX - planet.x;
    const dy = offsetY - planet.y;
    if (Math.sqrt(dx ** 2 + dy ** 2) <= planet.radius) {
      if (planet.name === "Planet Prime") {
        openPlanetPrimeMenu();
      } else {
        moveShipTo(planet);
      }
    }
  });
});

// Move Ship
function moveShipTo(targetPlanet) {
  const dx = targetPlanet.x - (ship.x + ship.width / 2);
  const dy = targetPlanet.y - (ship.y + ship.height / 2);
  const distance = Math.sqrt(dx ** 2 + dy ** 2);
  const fuelCost = Math.ceil(distance / 50);

  if (fuel < fuelCost) {
    showMessage("Not enough fuel to travel!", "error");
    return;
  }

  fuel -= fuelCost;
  updateHUD();

  const steps = 50; // Number of animation steps
  let currentStep = 0;
  const stepX = dx / steps;
  const stepY = dy / steps;

  const interval = setInterval(() => {
    if (currentStep >= steps) {
      clearInterval(interval);
      ship.x = targetPlanet.x - ship.width / 2;
      ship.y = targetPlanet.y - ship.height / 2;
      showMessage(`Arrived at ${targetPlanet.name}`, "success");
      openPlanetMenu(targetPlanet);
    } else {
      ship.x += stepX;
      ship.y += stepY;
      currentStep++;
      draw();
    }
  }, 16);
}

// Planet Menus
function openPlanetPrimeMenu() {
  menuBox.innerHTML = "<h3>Planet Prime Menu</h3>";
  const jobButton = document.createElement("button");
  jobButton.textContent = "Choose a Job";
  jobButton.onclick = chooseJob;
  menuBox.appendChild(jobButton);
}

function openPlanetMenu(planet) {
  menuBox.innerHTML = `<h3>Welcome to ${planet.name}</h3>`;
  const fuelButton = document.createElement("button");
  fuelButton.textContent = "Refuel";
  fuelButton.onclick = () => {
    fuel += 10;
    credits -= 20;
    showMessage("Refueled 10 units for 20 credits.", "success");
    updateHUD();
  };
  menuBox.appendChild(fuelButton);
}

// Job System
function chooseJob() {
  const jobs = generateJobs();
  menuBox.innerHTML = "<h3>Choose a Job:</h3>";
  jobs.forEach((job) => {
    const jobButton = document.createElement("button");
    jobButton.textContent = `Travel to ${job.targetPlanet.name} (${job.payout} credits, Risk: ${job.risk})`;
    jobButton.onclick = () => {
      currentJob = job;
      showMessage(`Job accepted: Travel to ${job.targetPlanet.name}`, "success");
      updateHUD();
    };
    menuBox.appendChild(jobButton);
  });
}

function generateJobs() {
  return planets.slice(1).map((planet) => {
    const risk = ["low", "medium", "high"][Math.floor(Math.random() * 3)];
    const payout = planet.distanceFromPrime * 50;
    return {
      risk,
      targetPlanet: planet,
      payout,
    };
  });
}

// Initialize Game
function initializeGame() {
  resizeCanvas();
  updateHUD();
  showMessage("Welcome to Galaxy Explorer!", "success");
  openPlanetPrimeMenu();
}

initializeGame();