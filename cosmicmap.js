<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Map and Movement Test</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background-color: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    #mapContainer {
      position: relative;
      border: 2px solid #ffffff;
      border-radius: 5px;
      width: 90%;
      height: 90%;
      max-width: 1200px;
      max-height: 800px;
      overflow: hidden;
      background-color: #000;
    }
    canvas {
      display: block;
      background-color: #000;
      width: 100%;
      height: 100%;
    }
    #planetMenu {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(20, 20, 20, 0.9);
      color: #ffcc00;
      border: 2px solid #ffcc00;
      border-radius: 5px;
      padding: 20px;
      text-align: center;
      display: none;
      font-family: monospace;
    }
    #planetMenu button {
      margin-top: 10px;
      padding: 10px 20px;
      background-color: #333;
      color: #ffcc00;
      border: 1px solid #ffcc00;
      border-radius: 3px;
      cursor: pointer;
      font-family: monospace;
    }
    #planetMenu button:hover {
      background-color: #555;
    }
  </style>
</head>
<body>
  <div id="mapContainer">
    <canvas id="mapCanvas"></canvas>
    <div id="planetMenu">
      <p id="planetName">Welcome to the Planet</p>
      <button onclick="closeMenu()">Leave</button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const planetMenu = document.getElementById('planetMenu');
    const planetNameElement = document.getElementById('planetName');

    const planets = [];
    const ship = { x: 0, y: 0, radius: 10, color: '#00bfff' };

    // Resize canvas to fit the container
    function resizeCanvas() {
      const container = document.getElementById('mapContainer');
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      generatePlanets();
      draw();
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Generate planets
    function generatePlanets() {
      planets.length = 0;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Prime Planet
      planets.push({ x: centerX, y: centerY, radius: 30, color: '#ff6600', name: 'Prime Planet' });

      // Other planets
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * Math.min(canvas.width, canvas.height) * 0.3;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        planets.push({ x, y, radius: 20, color: '#00bfff', name: `Planet ${i + 1}` });
      }

      // Place ship at the Prime Planet
      ship.x = centerX;
      ship.y = centerY;
    }

    // Draw everything
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw star chart lines
      ctx.strokeStyle = '#555555';
      ctx.lineWidth = 1;
      planets.forEach((planet, index) => {
        for (let j = index + 1; j < planets.length; j++) {
          ctx.beginPath();
          ctx.moveTo(planet.x, planet.y);
          ctx.lineTo(planets[j].x, planets[j].y);
          ctx.stroke();
        }
      });

      // Draw planets
      planets.forEach(planet => {
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
        ctx.strokeStyle = planet.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw ship
      ctx.beginPath();
      ctx.arc(ship.x, ship.y, ship.radius, 0, Math.PI * 2);
      ctx.strokeStyle = ship.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Move ship to a target planet
    function moveShipTo(target) {
      const dx = target.x - ship.x;
      const dy = target.y - ship.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = 2; // Adjust speed as needed
      const steps = distance / speed;
      const stepX = dx / steps;
      const stepY = dy / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep >= steps) {
          clearInterval(interval);
          ship.x = target.x;
          ship.y = target.y;
          openMenu(target);
        } else {
          ship.x += stepX;
          ship.y += stepY;
          currentStep++;
        }
        draw();
      }, 16);
    }

    // Handle click events
    canvas.addEventListener('click', (event) => {
      const { offsetX, offsetY } = event;
      planets.forEach(planet => {
        const dx = offsetX - planet.x;
        const dy = offsetY - planet.y;
        if (Math.sqrt(dx * dx + dy * dy) <= planet.radius) {
          console.log(`Clicked on: ${planet.name}`);
          moveShipTo(planet);
        }
      });
    });

    // Open menu when ship arrives at a planet
    function openMenu(planet) {
      planetNameElement.textContent = `Welcome to ${planet.name}`;
      planetMenu.style.display = 'block';
    }

    // Close menu and return to map
    function closeMenu() {
      planetMenu.style.display = 'none';
    }

    generatePlanets();
    draw();
  </script>
</body>
</html>
