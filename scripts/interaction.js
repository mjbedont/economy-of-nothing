// Import utility functions
import { loadPlanetContent } from './utils.js';
import { drawMap } from './map.js';

// Visit a planet when clicked
export function visitPlanet(planet) {
  // Calculate fuel usage to travel to this planet
  const fuelUsage = calculateTravelFuelUsage(currentPlanet || prime, planet);

  // Check if the player has enough fuel
  if (fuel < fuelUsage) {
    endGame(); // If not enough fuel, end the game
    return;
  }

  fuel -= fuelUsage; // Deduct fuel
  animateShipTravel(planet, () => {
    currentPlanet = planet; // Update the current planet after travel

    // Handle planet-specific logic
    if (planet.hub) {
      primeReturns += 1;
      resetMissions(); // Reset missions for non-hub planets
      displayMessage(`Welcome back to ${planet.name}!`);
    } else {
      displayMessage(`Arrived at ${planet.name}. Fuel used: ${fuelUsage}.`);
    }

    updateStats(); // Update the stats UI
    drawMap(); // Redraw the map
    loadPlanetContent(planet); // Load the planet's Codex content (from `utils.js`)
  });
}

// Calculate the fuel usage to travel between two planets
function calculateTravelFuelUsage(current, destination) {
  return Math.ceil(Math.sqrt((destination.x - current.x) ** 2 + (destination.y - current.y) ** 2) / 100);
}

// Animate the ship's travel from the current position to the destination
function animateShipTravel(destination, callback) {
  const steps = 50; // Number of steps for the animation
  const dx = (destination.x - ship.x) / steps; // Calculate the step size for x-coordinate
  const dy = (destination.y - ship.y) / steps; // Calculate the step size for y-coordinate

  let step = 0; // Track the current step in the animation
  const interval = setInterval(() => {
    ship.x += dx; // Update ship's x-coordinate
    ship.y += dy; // Update ship's y-coordinate
    step++;

    drawMap(); // Redraw the map after each step
    if (step >= steps) {
      clearInterval(interval); // Stop the animation after all steps
      callback(); // Call the callback once animation is complete
    }
  }, 16); // Update the position every 16ms for smooth animation
}

// Reset missions for non-hub planets when returning to a hub planet
function resetMissions() {
  planets.forEach((planet) => {
    if (!planet.hub) {
      planet.missionCompleted = false; // Reset missions for non-hub planets
    }
  });
}

// Display messages to the player (e.g., "Fuel used", "Mission completed")
function displayMessage(message) {
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = message; // Update the message box with the new message
}

// End the game if the player runs out of fuel
function endGame() {
  const leaderboard = document.getElementById("leaderboard");
  const finalPod = document.getElementById("finalPod");
  const finalCredits = document.getElementById("finalCredits");
  const restartButton = document.getElementById("restartButton");

  finalPod.textContent = primeReturns > 0 ? (promotions / primeReturns).toFixed(2) : "0";
  finalCredits.textContent = credits;
  leaderboard.style.display = "block"; // Show the game over leaderboard

  // Restart the game when the player clicks "Restart Game"
  restartButton.onclick = () => {
    leaderboard.style.display = "none";
    resetGame();
  };
}

// Reset the game to its initial state
function resetGame() {
  fuel = 20;
  credits = 100;
  promotions = 0;
  primeReturns = 0;
  currentPlanet = prime; // Start at Planet Prime
  ship.x = prime.x; // Ship starts at Planet Prime's location
  ship.y = prime.y;

  planets.forEach((planet) => {
    planet.missionCompleted = false; // Reset all missions
  });

  updateStats(); // Update the stats UI
  drawMap(); // Redraw the map
  displayMessage("Ready for your next move!"); // Display a ready message
}
