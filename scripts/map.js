// Get the canvas and its 2D context
const canvas = document.getElementById("galaxyMap");
const ctx = canvas.getContext("2d");

// Initialize Canvas size
export function initializeCanvas() {
  canvas.width = window.innerWidth * 0.8; // Set width to 80% of the window width
  canvas.height = window.innerHeight * 0.8; // Set height to 80% of the window height
}

// Function to draw the galaxy map
export function drawMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  drawRoutes(); // Draw lines between the planets
  drawPlanets(); // Draw the planets
  drawShip(); // Draw the ship's position
}

// Draw the routes between planets (lines connecting them)
function drawRoutes() {
  ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"; // Set the color for the routes
  ctx.setLineDash([10, 5]); // Dashed lines for routes
  ctx.beginPath();

  // Loop through all planets and draw lines between them
  planets.forEach((start) => {
    planets.forEach((end) => {
      if (start !== end) {
        ctx.moveTo(start.x, start.y); // Start the line at the planet's position
        ctx.lineTo(end.x, end.y); // End the line at the other planet's position
      }
    });
  });

  ctx.stroke(); // Render the path
}

// Draw the planets on the map
function drawPlanets() {
  planets.forEach((planet) => {
    // Set color based on whether the player is currently on the planet
    ctx.fillStyle = currentPlanet === planet ? "cyan" : "#00FF00";
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, 15, 0, Math.PI * 2); // Draw a circle for each planet
    ctx.fill(); // Fill the planet with the selected color

    // Set the text style for the planet label
    ctx.fillStyle = "#00FF00";
    ctx.font = "12px monospace";
    ctx.fillText(planet.name, planet.x - 30, planet.y - 20); // Display planet name near the planet
  });
}

// Draw the ship's current position
function drawShip() {
  ctx.fillStyle = "yellow"; // Set the ship color
  ctx.beginPath();
  ctx.arc(ship.x, ship.y, 5, 0, Math.PI * 2); // Draw the ship as a small circle
  ctx.fill(); // Fill the ship's position with the selected color
}

// Canvas click event handler (called from main.js)
export function canvasClickHandler(e, planets, visitPlanet) {
  const rect = canvas.getBoundingClientRect(); // Get canvas position on screen
  const mouseX = e.clientX - rect.left; // Calculate mouse x-coordinate relative to canvas
  const mouseY = e.clientY - rect.top;  // Calculate mouse y-coordinate relative to canvas

  planets.forEach((planet) => {
    const distance = Math.sqrt(
      (mouseX - planet.x) ** 2 + (mouseY - planet.y) ** 2 // Calculate distance from mouse click to planet
    );
    if (distance < 15) {
      visitPlanet(planet); // If the click is within the planet's radius (15px), visit the planet
    }
  });
}

