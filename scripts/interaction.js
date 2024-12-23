import { loadPlanetContent } from './utils.js';
import { drawMap } from './map.js';

export function visitPlanet(planet) {
  // Calculate fuel usage and perform interactions when visiting a planet
  const fuelUsage = calculateTravelFuelUsage(currentPlanet || prime, planet);

  if (fuel < fuelUsage) {
    endGame();
    return;
  }

  fuel -= fuelUsage;
  animateShipTravel(planet, () => {
    currentPlanet = planet;

    // Reset missions and actions based on planet type
    if (planet.hub) {
      primeReturns += 1;
      resetMissions();
      displayMessage(`Welcome back to ${planet.name}!`);
    } else {
      displayMessage(`Arrived at ${planet.name}. Fuel used: ${fuelUsage}.`);
    }

    updateStats();
    drawMap();
    loadPlanetContent(planet); // Load dynamic content for the planet
  });
}

function calculateTravelFuelUsage(current, destination) {
  return Math.ceil(Math.sqrt((destination.x - current.x) ** 2 + (destination.y - current.y) ** 2) / 100);
}

function animateShipTravel(destination, callback) {
  const steps = 50;
  const dx = (destination.x - ship.x) / steps;
  const dy = (destination.y - ship.y) / steps;

  let step = 0;
  const interval = setInterval(() => {
    ship.x += dx;
    ship.y += dy;
    step++;
    drawMap();
    if (step >= steps) {
      clearInterval(interval);
      callback();
    }
  }, 16);
}
