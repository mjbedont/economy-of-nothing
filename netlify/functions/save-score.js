const fetch = require("node-fetch");

const OWNER = "mjbedont";
const REPO = "economy-of-nothing";
const FILE_PATH = "pay-to-lose/scores.json";
const BRANCH = "main";
const TOKEN = process.env.GITHUB_TOKEN;

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let newScore;
  try {
    newScore = JSON.parse(event.body);
    if (!newScore || typeof newScore.money !== "number") {
      throw new Error("Invalid score format");
    }
  } catch (err) {
    return { statusCode: 400, body: "Invalid JSON input" };
  }

  const headers = {
    Authorization: `token ${TOKEN}`,
    Accept: "application/vnd.github.v3+json"
  };

  const getUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const getRes = await fetch(getUrl, { headers });
  if (!getRes.ok) {
    return { statusCode: 500, body: "Failed to read scores.json" };
  }

  const fileData = await getRes.json();
  const sha = fileData.sha;
  let scores = JSON.parse(Buffer.from(fileData.content, 'base64').toString());

  scores.push(newScore);
  scores.sort((a, b) => b.money - a.money);
  scores = scores.slice(0, 10); // top 10 only

  const updatedContent = Buffer.from(JSON.stringify(scores, null, 2)).toString('base64');

  const putRes = await fetch(getUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: `Update leaderboard: $${newScore.money}`,
      content: updatedContent,
      sha,
      branch: BRANCH
    })
  });

  if (!putRes.ok) {
    return { statusCode: 500, body: "Failed to update scores.json" };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, scores })
  };
};
