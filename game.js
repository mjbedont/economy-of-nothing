// === Game Variables ===
let fuel = 10; // Initial fuel
let medicalKits = 3; // Initial medical kits
let repairTools = 2; // Initial repair tools
let credits = 100; // Starting credits

// === Mission Parameters ===
let distance = 0;
let hazards = [];
let survivors = 0;
let shipCondition = "";

// === Game Functions ===

// Randomize a distress signal
function generateMission() {
  distance = Math.floor(Math.random() * 10) + 5; // Random distance (5-15 units)
  survivors = Math.floor(Math.random() * 5) + 1; // Random survivors (1-5)
  shipCondition = ["Critical", "Stable", "Damaged"][Math.floor(Math.random() * 3)];
  hazards = Array.from({ length: Math.floor(Math.random() * 3) }, () =>
    ["Asteroid", "Pirates"][Math.floor(Math.random() * 2)]
  );

  console.log(`DISTRESS SIGNAL: A ship ${distance} units away needs help!`);
  console.log(`Survivors: ${survivors}`);
  console.log(`Ship Condition: ${shipCondition}`);
  console.log(`Hazards: ${hazards.length > 0 ? hazards.join(", ") : "None"}`);
  console.log(`Potential Reward: ${survivors * 50} credits`);
}

// Handle stocking up on resources
function stockResources() {
  console.log("STOCK UP:");
  console.log(`Current Credits: ${credits}`);
  console.log(`Fuel: ${fuel}, Medical Kits: ${medicalKits}, Repair Tools: ${repairTools}`);
  const fuelPurchase = parseInt(prompt("How much fuel to buy? (1 unit = 10 credits)"), 10);
  const kitsPurchase = parseInt(prompt("How many medical kits to buy? (1 kit = 15 credits)"), 10);
  const toolsPurchase = parseInt(prompt("How many repair tools to buy? (1 tool = 20 credits)"), 10);

  const totalCost = fuelPurchase * 10 + kitsPurchase * 15 + toolsPurchase * 20;
  if (totalCost > credits) {
    console.log("Not enough credits! Stocking failed.");
  } else {
    credits -= totalCost;
    fuel += fuelPurchase;
    medicalKits += kitsPurchase;
    repairTools += toolsPurchase;
    console.log("Resources successfully stocked!");
  }
}

// Travel to the distress signal
function travel() {
  console.log("TRAVEL PHASE:");
  for (let i = 0; i < distance; i++) {
    if (fuel <= 0) {
      console.log("You ran out of fuel and failed the mission!");
      return false; // Mission failure
    }
    fuel--;

    // Randomly encounter hazards
    if (hazards.length > 0 && Math.random() < 0.3) {
      const hazard = hazards.pop();
      console.log(`Encountered: ${hazard}`);
      if (hazard === "Asteroid") {
        if (repairTools > 0) {
          repairTools--;
          console.log("Used a repair tool to avoid damage.");
        } else {
          console.log("No repair tools! Suffered damage.");
        }
      } else if (hazard === "Pirates") {
        credits -= 50;
        console.log("Lost 50 credits to pirates.");
      }
    }
  }
  console.log("Arrived at the distress signal!");
  return true;
}

// Rescue survivors
function rescue() {
  console.log("RESCUE PHASE:");
  if (shipCondition === "Critical" && repairTools > 0) {
    repairTools--;
    console.log("Repaired the ship's critical systems.");
  } else if (shipCondition === "Critical") {
    console.log("Failed to repair the ship. Survivors lost!");
    survivors = 0;
  }

  if (survivors > 0 && medicalKits >= survivors) {
    medicalKits -= survivors;
    console.log(`Rescued all ${survivors} survivors!`);
  } else if (survivors > 0) {
    console.log("Not enough medical kits! Only some survivors were rescued.");
    survivors = medicalKits;
    medicalKits = 0;
  }

  const reward = survivors * 50;
  console.log(`Mission Reward: ${reward} credits`);
  credits += reward;
}

// Main game loop
function main() {
  console.log("Welcome to the Distress Call Simulator!");
  while (true) {
    generateMission();
    stockResources();
    if (!travel()) break; // End game if travel fails
    rescue();
    console.log("Mission Complete!");
    console.log(`Remaining Fuel: ${fuel}, Credits: ${credits}`);
    if (fuel <= 0) {
      console.log("Out of fuel! Game Over.");
      break;
    }

    const playAgain = prompt("Play another mission? (Y/N)").toUpperCase();
    if (playAgain !== "Y") break;
  }
  console.log("Thanks for playing!");
}

// Start the game
main();
