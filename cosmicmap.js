<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Galactic Economy Map</title>
  <style>
    body {
      font-family: "Courier New", monospace;
      background-color: black;
      color: #00FF00;
      margin: 0;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    canvas {
      background-color: black;
      border: 2px solid #00FF00;
      display: block;
    }

    #infoPanel, #planetScreen {
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #00FF00;
      padding: 10px;
      font-family: "Courier New", monospace;
      color: #00FF00;
    }

    #infoPanel {
      top: 10px;
      left: 10px;
    }

    #planetScreen {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
      width: 300px;
    }

    .button {
      display: block;
      margin: 10px 0;
      padding: 10px;
      background: black;
      border: 2px solid #00FF00;
      color: #00FF00;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
    }

    .button:hover {
      background: #00FF00;
      color: black;
    }

    #planetImage {
      width: 100%;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <canvas id="galaxyMap"></canvas>
  <div id="infoPanel">
    <div>Fuel: <span id="fuel">20</span></div>
    <div>Credits: <span id="credits">100</span></div>
    <div>Promotions: <span id="promotions">0</span></div>
  </div>
  <div id="planetScreen">
    <h3 id="planetTitle">Welcome to Planet</h3>
    <img id="planetImage" src="" alt="Planet Image">
    <div id="planetLore" style="margin-top: 10px; font-size: 12px;">
      <!-- Planet-specific lore will appear here -->
    </div>
    <div id="planetButtons"></div>
  </div>
  <script>
    const canvas = document.getElementById("galaxyMap");
    const ctx = canvas.getContext("2d");

    let fuel = 20;
    let credits = 100;
    let promotions = 0;
    let ship = { x: 0, y: 0 };
    let planets = [
      { name: "Planet Prime", file: "planet-prime.html", x: 0, y: 0 },
      { name: "Brenner 7", file: "brenner-7.html", x: 0, y: 0 },
      { name: "Dracronaria", file: "dracronaria.html", x: 0, y: 0 },
    ];

    function resizeCanvas() {
      canvas.width = window.innerWidth * 0.8;
      canvas.height = window.innerHeight * 0.8;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function drawMap() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      planets.forEach((planet) => {
        planet.x = Math.random() * (canvas.width - 100) + 50;
        planet.y = Math.random() * (canvas.height - 100) + 50;

        ctx.fillStyle = "#00FF00";
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#00FF00";
        ctx.font = "12px monospace";
        ctx.fillText(planet.name, planet.x - 30, planet.y - 20);
      });

      drawShip();
    }

    function drawShip() {
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(ship.x, ship.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    function fetchPlanetData(planet, callback) {
      fetch(`./codex/locations/${planet.file}`)
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const lore = doc.querySelector("#lore") ? doc.querySelector("#lore").innerHTML : "No lore available.";
          const img = doc.querySelector("img") ? doc.querySelector("img").src : "";

          callback({ lore, img });
        })
        .catch((error) => {
          console.error("Error fetching planet data:", error);
          callback({ lore: "Error loading planet data.", img: "" });
        });
    }

    function visitPlanet(planet) {
      const planetScreen = document.getElementById("planetScreen");
      const planetTitle = document.getElementById("planetTitle");
      const planetImage = document.getElementById("planetImage");
      const planetLore = document.getElementById("planetLore");
      const planetButtons = document.getElementById("planetButtons");

      planetScreen.style.display = "block";
      planetTitle.textContent = `Welcome to ${planet.name}`;

      fetchPlanetData(planet, (data) => {
        planetLore.innerHTML = data.lore;
        planetImage.src = data.img;
      });

      planetButtons.innerHTML = "";
      const leaveButton = document.createElement("div");
      leaveButton.className = "button";
      leaveButton.textContent = "Leave Planet";
      leaveButton.onclick = () => {
        planetScreen.style.display = "none";
      };
      planetButtons.appendChild(leaveButton);
    }

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      planets.forEach((planet) => {
        const distance = Math.sqrt(
          (mouseX - planet.x) ** 2 + (mouseY - planet.y) ** 2
        );
        if (distance < 15) {
          visitPlanet(planet);
        }
      });
    });

    drawMap();
  </script>
</body>
</html>