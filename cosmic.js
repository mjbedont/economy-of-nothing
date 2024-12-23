// Selectors for HTML elements
const canvas = document.getElementById('gameCanvas');
const startButton = document.getElementById('startButton');
const ctx = canvas.getContext('2d');

// Game state variables
let gameState = {
    fuel: 5,
    score: 0,
    currentPlanet: 'Planet Prime',
    shipType: 'medium',
};

// Event listeners
startButton.addEventListener('click', startGame);

// Start the game
function startGame() {
    initializeGame();
    requestAnimationFrame(gameLoop);
}

// Initialize the game
function initializeGame() {
    // Set up initial game state
    console.log("Game started!");
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Update logic (e.g., fuel consumption, player actions)
}

// Draw the game
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw galaxy map, planets, and ship
    drawGalaxy();
}

// Helper functions
function drawGalaxy() {
    // Example: Draw planets
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(100, 100, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}
