// Import modules
import { drawMap, initializeCanvas, canvasClickHandler } from './map.js';
import { visitPlanet, loadPlanetContent } from './interaction.js';
import { updateStats, displayMessage } from './utils.js';

// Game State Variables
let fuel = 20;
let credits = 100;
let promotions = 0;
let primeReturns = 0;
let ship = { x: 0, y: 0 };
let currentPlanet = null;

// Planets Definition
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

// Initialize the game and load the first planet
function initializeGame() {
  initializeCanvas();
  drawMap();
  visitPlanet(planets[0]);
}

// Start Game
initializeGame();

// Canvas click listener for planet interactions
canvas.addEventListener("click", (e) => canvasClickHandler(e, planets, visitPlanet));

// Update Stats every time there's a change
updateStats();

// Functions for updating the game stats and messages
function updateStats() {
  // Update the displayed values
  document.getElementById("fuel").textContent = fuel;
  document.getElementById("credits").textContent = credits;
  document.getElementById("promotions").textContent = promotions;
  document.getElementById("primeReturns").textContent = primeReturns;
  document.getElementById("pod").textContent = primeReturns > 0 ? (promotions / primeReturns).toFixed(2) : "0";
}

function displayMessage(message) {
  // Display message in the UI
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = message;
}
