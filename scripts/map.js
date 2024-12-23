const canvas = document.getElementById("galaxyMap");
const ctx = canvas.getContext("2d");

// Initialize Canvas Size
export function initializeCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.8;
}

// Draw the Galaxy Map (planets, routes, etc.)
export function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRoutes();
  drawPlanets();
  drawShip();
}

// Drawing the routes between planets (lines)
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

// Drawing the planets on the map
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

// Drawing the ship on the map
function drawShip() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(ship.x, ship.y, 5, 0, Math.PI * 2);
  ctx.fill();
}

// Canvas Click Event Handler (called from main.js)
export function canvasClickHandler(e, planets, visitPlanet) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  planets.forEach((planet) => {
    const distance = Math.sqrt((mouseX - planet.x) ** 2 + (mouseY - planet.y) ** 2);
    if (distance < 15) {
      visitPlanet(planet);
    }
  });
}
