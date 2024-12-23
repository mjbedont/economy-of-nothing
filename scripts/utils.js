// Create a button with a label and event handler
export function createButton(label, onClick) {
  const button = document.createElement("div"); // Create a new <div> element
  button.className = "button"; // Add a class for styling
  button.textContent = label; // Set the button's text content
  button.onclick = onClick; // Attach the event handler to the button's click event
  return button; // Return the created button
}

// Load planet content dynamically (from Codex HTML)
export function loadPlanetContent(planet) {
  const planetScreen = document.getElementById("planetScreen");
  const planetTitle = document.getElementById("planetTitle");
  const planetInfo = document.getElementById("planetInfo");
  const planetButtons = document.getElementById("planetButtons");
  const planetLore = document.getElementById("planetLore");

  planetScreen.style.display = "block"; // Show the planet screen
  planetTitle.textContent = `Welcome to ${planet.name}`; // Set the planet's name in the title

  // Fetch the Codex content for the planet (HTML file)
  const codexFile = `/codex/location/${planet.name.toLowerCase().replace(/\s+/g, '-')}.html`;
  fetch(codexFile)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${codexFile}`);
      }
      return response.text(); // Get the HTML content
    })
    .then((htmlContent) => {
      planetInfo.innerHTML = htmlContent; // Insert the Codex content into the planet info section
    })
    .catch((error) => {
      console.error(error);
      planetInfo.innerHTML = `<p>Error loading content for ${planet.name}.</p>`; // Show an error message if fetching fails
    });

  // Clear and add action buttons based on planet type
  planetButtons.innerHTML = ""; // Clear any old buttons
  const leaveButton = createButton("Leave Planet", () => {
    planetScreen.style.display = "none"; // Hide the planet screen when leaving
  });
  planetButtons.appendChild(leaveButton); // Append the "Leave Planet" button

  // Add more buttons depending on the planet type
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

    // Mission button for non-hub planets (if the mission is not completed)
    if (!planet.missionCompleted) {
      const missionButton = createButton(`Start Mission (Reward: ${missionPayout} credits)`, () => {
        credits += missionPayout;
        planet.missionCompleted = true;
        updateStats();
        displayMessage(`Mission completed on ${planet.name}. Earned ${missionPayout} credits.`);
        loadPlanetContent(planet); // Reload the content to update the mission status
      });
      planetButtons.appendChild(missionButton);
    }
  }
}

// Function to update the stats displayed on the UI
export function updateStats() {
  document.getElementById("fuel").textContent = fuel;
  document.getElementById("credits").textContent = credits;
  document.getElementById("promotions").textContent = promotions;
  document.getElementById("primeReturns").textContent = primeReturns;
  document.getElementById("pod").textContent = primeReturns > 0 ? (promotions / primeReturns).toFixed(2) : "0";
}

// Function to display messages to the player
export function displayMessage(message) {
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = message;
}

// Function to calculate the price of fuel at a planet based on its distance from Planet Prime
function calculateFuelPriceFromPrime(planet) {
  const distance = Math.sqrt((planet.x - prime.x) ** 2 + (planet.y - prime.y) ** 2);
  return 2 + Math.ceil(distance / 100); // Base price + distance multiplier
}

// Function to calculate mission payout based on the distance from Planet Prime
function calculateMissionPayoutFromPrime(planet) {
  const distance = Math.sqrt((planet.x - prime.x) ** 2 + (planet.y - prime.y) ** 2);
  return 10 + Math.ceil(distance / 50); // Base payout + distance multiplier
}
