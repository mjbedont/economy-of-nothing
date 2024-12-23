// Create a button with label and event handler
export function createButton(label, onClick) {
  const button = document.createElement("div");
  button.className = "button";
  button.textContent = label;
  button.onclick = onClick;
  return button;
}

// Load planet content (from Codex)
export function loadPlanetContent(planet) {
  const planetScreen = document.getElementById("planetScreen");
  const planetTitle = document.getElementById("planetTitle");
  const planetInfo = document.getElementById("planetInfo");
  const planetButtons = document.getElementById("planetButtons");
  const planetLore = document.getElementById("planetLore");

  planetScreen.style.display = "block";
  planetTitle.textContent = `Welcome to ${planet.name}`;

  // Fetch Codex content dynamically
  const codexFile = `/codex/location/${planet.name.toLowerCase().replace(/\s+/g, '-')}.html`;
  fetch(codexFile)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load ${codexFile}`);
      }
      return response.text();
    })
    .then((htmlContent) => {
      planetInfo.innerHTML = htmlContent;
    })
    .catch((error) => {
      console.error(error);
      planetInfo.innerHTML = `<p>Error loading content for ${planet.name}.</p>`;
    });

  // Add buttons and other planet-specific actions
  planetButtons.innerHTML = ""; // Clear old buttons
  const leaveButton = createButton("Leave Planet", () => {
    planetScreen.style.display = "none"; // Close planet screen
  });
  planetButtons.appendChild(leaveButton);
}
