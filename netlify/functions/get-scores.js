const fetch = require("node-fetch");

const OWNER = "mjbedont";
const REPO = "economy-of-nothing";
const FILE_PATH = "pay-to-lose/scores.json";
const TOKEN = process.env.GITHUB_TOKEN;

exports.handler = async function (event, context) {
  const headers = {
    Authorization: `token ${TOKEN}`,
    Accept: "application/vnd.github.v3+json"
  };

  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    
    const fileData = await res.json();
    const content = Buffer.from(fileData.content, 'base64').toString();
    const scores = JSON.parse(content);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, scores })
    };
  } catch (err) {
    console.error("❌ Error reading leaderboard:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Failed to load scores." })
    };
  }
};
