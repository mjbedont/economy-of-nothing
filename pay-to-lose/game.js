let position = 0;
let money = 100;
let debt = 0;
let gameOver = false;
let scoreList = JSON.parse(localStorage.getItem("eonScores")) || [];

const gameOverMessages = [
  "Jailed for Insufficient Funds.",
  "Ejected from the Economy for Lack of Value.",
  "Died of No Money.",
  "Fired for Insolvency.",
  "Your Credit Score Was Negative.",
  "Liquidated by Dispatch.",
  "Recycled as Emotional Nutrients."
];

const fallbackEvents = [
  { type: "money", amount: -15, text: "Charged a 'vibe adjustment' fee." },
  { type: "money", amount: 10, text: "Received a merit-based micro-raise (+$10)." },
  { type: "debt", amount: 5, text: "Issued a promotional debt voucher (+$5)." },
  { type: "debtPercent", percent: 0.1, text: "Your debt gained sentience." },
  { type: "neutral", text: "Nothing happened. Time was extracted for corporate use." }
];

const tileDescriptions = {
  3: "📎 Encountered a motivational poster with hostile energy.",
  7: "🍕 Mandatory team-building retreat. Lost time, gained nothing.",
  13: "🏆 Nominated for Employee of the Quarter. It’s not a good thing.",
  27: "🧑‍💻 Auto-reviewed by an AI that thinks you’re redundant.",
  42: "🪫 Black cube labeled 'Asset Reassessment' rolled across your desk.",
  66: "🌀 A door opened. You heard your old self screaming."
};

function log(msg) {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML += `<p>▶ ${msg}</p>`;
  logDiv.scrollTop = logDiv.scrollHeight;
}

function flashStat(id, color) {
  const el = document.getElementById(id);
  el.style.transition = "color 0.2s";
  el.style.color = color;
  setTimeout(() => { el.style.color = ""; }, 400);
}

function updateLeaderboard(finalScore) {
  scoreList.push(finalScore);
  scoreList.sort((a, b) => b.money - a.money);
  localStorage.setItem("eonScores", JSON.stringify(scoreList));

  const list = document.getElementById("scoreList");
  list.innerHTML = "";
  scoreList.forEach(s => {
    const li = document.createElement("li");
    li.textContent = `Space ${s.position}, $${s.money.toFixed(2)} cash, $${s.debt.toFixed(2)} debt`;
    list.appendChild(li);
  });
}

function resetGame() {
  updateLeaderboard({ position, money, debt });
  position = 0;
  money = 100;
  debt = 0;
  gameOver = false;
  document.getElementById("position").textContent = position;
  document.getElementById("money").textContent = money.toFixed(2);
  document.getElementById("debt").textContent = debt.toFixed(2);
  document.getElementById("log").innerHTML = "";
  document.getElementById("rollBtn").disabled = false;
  document.getElementById("rollBtn").focus();
}

async function fetchEvent() {
  const sources = ['events/good.json', 'events/bad.json'];
  const allEvents = [];

  for (const src of sources) {
    try {
      const res = await fetch(src);
      const data = await res.json();
      allEvents.push(...data);
    } catch (err) {
      console.warn(`Failed to load ${src}`, err);
    }
  }

  if (allEvents.length === 0) {
    return fallbackEvents[Math.floor(Math.random() * fallbackEvents.length)];
  }

  return allEvents[Math.floor(Math.random() * allEvents.length)];
}

async function rollDice() {
  if (gameOver) return;

  const roll = Math.floor(Math.random() * 6) + 1;
  position += roll;

  const event = await fetchEvent();
  let resultMsg = `You rolled a ${roll}. Advanced to tile ${position}. `;

  if (event.type === "money") {
    money += event.amount;
    resultMsg += event.text;
    flashStat("money", event.amount < 0 ? "red" : "lime");
  } else if (event.type === "debt") {
    debt += event.amount;
    resultMsg += event.text;
    flashStat("debt", "orange");
  } else if (event.type === "debtPercent") {
    const interest = debt * event.percent;
    debt += interest;
    resultMsg += `${event.text} (+$${interest.toFixed(2)} debt)`;
    flashStat("debt", "orange");
  } else {
    resultMsg += event.text;
  }

  // Add tile flavor if it exists
  if (tileDescriptions[position]) {
    resultMsg += `\n${tileDescriptions[position]}`;
  }

  // Rare special event
  if (Math.random() < 0.02) {
    money += 100;
    resultMsg += `\n🧾 You glimpsed the hidden ledger. +$100. You were not supposed to see that.`;
    flashStat("money", "gold");
  }

  if (money < 0) {
    const msg = gameOverMessages[Math.floor(Math.random() * gameOverMessages.length)];
    resultMsg += `\n🛑 GAME OVER: ${msg}`;
    gameOver = true;
    document.getElementById("rollBtn").disabled = true;

    setTimeout(() => {
      log(resultMsg);
      log(`🏁 Final Position: ${position}, 💵 $${money.toFixed(2)}, 📉 $${debt.toFixed(2)}`);
      setTimeout(() => {
        log("💸 Resetting simulator...");
        setTimeout(resetGame, 2000);
      }, 2000);
    }, 500);
  }

  document.getElementById("position").textContent = position;
  document.getElementById("money").textContent = money.toFixed(2);
  document.getElementById("debt").textContent = debt.toFixed(2);
  log(resultMsg);
}

// Preload leaderboard on page load
updateLeaderboard({ position: 0, money: 100, debt: 0 });
