// Selectors
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');

// For dynamic content
let modal = document.createElement('div');
modal.id = 'codexModal';
modal.style.display = 'none';
modal.style.position = 'absolute';
modal.style.backgroundColor = '#111';
modal.style.color = '#fff';
modal.style.padding = '20px';
modal.style.border = '2px solid #00ffcc';
modal.style.width = '80%';
modal.style.height = '60%';
modal.style.overflowY = 'auto';
modal.style.top = '20%';
modal.style.left = '10%';
document.body.appendChild(modal);

// Example planet data
const planets = [
    { name: 'Planet Prime', x: 400, y: 300, file: '/codex/location/planet-prime.html' },
    { name: 'Dracronaria', x: 600, y: 400, file: '/codex/location/dracronaria.html' },
    // Add other planets here
];

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Draw galaxy map
function drawGalaxy() {
    planets.forEach((planet) => {
        ctx.fillStyle = '#00ffcc';
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // Add planet labels
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(planet.name, planet.x - 20, planet.y - 15);
    });
}

// Detect click and check for planet interaction
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    planets.forEach((planet) => {
        const dx = mouseX - planet.x;
        const dy = mouseY - planet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if clicked on a planet
        if (distance < 10) {
            loadCodex(planet.file);
        }
    });
});

// Load Codex content dynamically
function loadCodex(filePath) {
    fetch(filePath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then((htmlContent) => {
            modal.innerHTML = htmlContent;
            modal.style.display = 'block';
        })
        .catch((error) => {
            console.error('Error loading Codex:', error);
        });
}

// Close Codex modal on click outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize the game
function initializeGame() {
    canvas.width = 800;
    canvas.height = 600;
    drawGalaxy();
    requestAnimationFrame(gameLoop);
}

// Start game
initializeGame();

