const canvas = document.getElementById("galaxyMap");
    const ctx = canvas.getContext("2d");

    // Responsive canvas size
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    // Game State
    let fuel = 20;
    let credits = 100;
    let promotions = 0;
    let primeReturns = 0;
    let ship = { x: 0, y: 0 };
    let currentPlanet = null;

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

    const planetPositions = generatePlanets(planets.length, canvas.width, canvas.height, 150);
    planets.forEach((planet, index) => {
      planet.x = planetPositions[index].x;
      planet.y = planetPositions[index].y;
    });

    const prime = planets[0];

    function generatePlanets(count, width, height, minDistance) {
      const positions = [];
      while (positions.length < count) {
        const x = Math.random() * (width - 100) + 50;
        const y = Math.random() * (height - 100) + 50;

        let tooClose = positions.some((pos) => {
          const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
          return distance < minDistance;
        });

        if (!tooClose) {
          positions.push({ x, y });
        }
      }
      return positions;
    }

    function calculateTravelFuelUsage(current, destination) {
      return Math.ceil(Math.sqrt((destination.x - current.x) ** 2 + (destination.y - current.y) ** 2) / 100);
    }

    function calculateFuelPriceFromPrime(planet) {
      const distance = Math.sqrt((planet.x - prime.x) ** 2 + (planet.y - prime.y) ** 2);
      return 2 + Math.ceil(distance / 100); // Base price + distance multiplier
    }

    function calculateMissionPayoutFromPrime(planet) {
      const distance = Math.sqrt((planet.x - prime.x) ** 2 + (planet.y - prime.y) ** 2);
      return 10 + Math.ceil(distance / 50); // Base payout + distance multiplier
    }

    function drawMap() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawRoutes();
      drawPlanets();
      drawShip();
    }

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

    function drawShip() {
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(ship.x, ship.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    function visitPlanet(planet) {
      const fuelUsage = calculateTravelFuelUsage(currentPlanet || prime, planet);

      if (fuel < fuelUsage) {
        endGame();
        return;
      }

      fuel -= fuelUsage;
      animateShipTravel(planet, () => {
        currentPlanet = planet;

        if (planet.hub) {
          primeReturns += 1;
          resetMissions();
          displayMessage(`Welcome back to ${planet.name}!`);
        } else {
          displayMessage(`Arrived at ${planet.name}. Fuel used: ${fuelUsage}.`);
        }

        updateStats();
        drawMap();
        updatePlanetScreen(planet);
      });
    }

    function updatePlanetScreen(planet) {
      const planetScreen = document.getElementById("planetScreen");
      const planetTitle = document.getElementById("planetTitle");
      const planetInfo = document.getElementById("planetInfo");
      const planetButtons = document.getElementById("planetButtons");
      const planetLore = document.getElementById("planetLore");

      planetScreen.style.display = "block";
      planetTitle.textContent = `Welcome to ${planet.name}`;
      planetLore.textContent = planet.lore;

      planetButtons.innerHTML = ""; // Clear old buttons

      if (planet.hub) {
        const buyFuelButton = createButton("Buy Fuel (2 credits/unit)", () => {
          if (credits >= 2) {
            credits -= 2;
            fuel++;
            updateStats();
            displayMessage("Bought 1 unit of fuel for 2 credits.");
          } else {
            displayMessage("Not enough credits to buy fuel!");
          }
        });
        planetButtons.appendChild(buyFuelButton);

        const buyPromotionButton = createButton("Buy Promotion (100 credits)", () => {
          if (credits >= 100) {
            credits -= 100;
            promotions++;
            updateStats();
            displayMessage("Promotion purchased!");
          } else {
            displayMessage("Not enough credits to buy a promotion!");
          }
        });
        planetButtons.appendChild(buyPromotionButton);
      } else {
        const fuelPrice = calculateFuelPriceFromPrime(planet);
        const missionPayout = calculateMissionPayoutFromPrime(planet);

        const buyFuelButton = createButton(`Buy Fuel (${fuelPrice} credits/unit)`, () => {
          if (credits >= fuelPrice) {
            credits -= fuelPrice;
            fuel++;
            updateStats();
            displayMessage(`Bought 1 unit of fuel for ${fuelPrice} credits.`);
          } else {
            displayMessage("Not enough credits to buy fuel!");
          }
        });
        planetButtons.appendChild(buyFuelButton);

        if (!planet.missionCompleted) {
          const missionButton = createButton(`Start Mission (Reward: ${missionPayout} credits)`, () => {
            credits += missionPayout;
            planet.missionCompleted = true;
            updateStats();
            displayMessage(`Mission completed on ${planet.name}. Earned ${missionPayout} credits.`);
            updatePlanetScreen(planet);
          });
          planetButtons.appendChild(missionButton);
        }
      }

      const leaveButton = createButton("Leave Planet", () => {
        planetScreen.style.display = "none";
      });
      planetButtons.appendChild(leaveButton);
    }

    function createButton(label, onClick) {
      const button = document.createElement("div");
      button.className = "button";
      button.textContent = label;
      button.onclick = onClick;
      return button;
    }

    function displayMessage(message) {
      const messageBox = document.getElementById("messageBox");
      messageBox.textContent = message;
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

    function resetMissions() {
      planets.forEach((planet) => {
        if (!planet.hub) {
          planet.missionCompleted = false;
        }
      });
    }

    function updateStats() {
      document.getElementById("fuel").textContent = fuel;
      document.getElementById("credits").textContent = credits;
      document.getElementById("promotions").textContent = promotions;
      document.getElementById("primeReturns").textContent = primeReturns;
      document.getElementById("pod").textContent = primeReturns > 0 ? (promotions / primeReturns).toFixed(2) : "0";
    }

    function endGame() {
      const leaderboard = document.getElementById("leaderboard");
      const finalPod = document.getElementById("finalPod");
      const finalCredits = document.getElementById("finalCredits");
      const restartButton = document.getElementById("restartButton");

      finalPod.textContent = primeReturns > 0 ? (promotions / primeReturns).toFixed(2) : "0";
      finalCredits.textContent = credits;
      leaderboard.style.display = "block";

      restartButton.onclick = () => {
        leaderboard.style.display = "none";
        resetGame();
      };
    }

    function resetGame() {
      fuel = 20;
      credits = 100;
      promotions = 0;
      primeReturns = 0;
      currentPlanet = prime;
      ship.x = prime.x;
      ship.y = prime.y;

      planets.forEach((planet) => {
        planet.missionCompleted = false;
      });

      updateStats();
      drawMap();
      displayMessage("Ready for your next move!");
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
    visitPlanet(prime);
