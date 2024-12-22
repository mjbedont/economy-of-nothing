const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { message } = JSON.parse(event.body);
    if (!message) {
        return { statusCode: 400, body: "Message is required" };
    }

    const filePath = path.join(__dirname, "messages.json");

    try {
        // Read existing messages
        const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : '{"messages":[]}';
        const json = JSON.parse(data);

        // Add the new message
        json.messages.push(message);

        // Save back to the file
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), "utf8");

        return { statusCode: 200, body: "Message saved successfully" };
    } catch (error) {
        console.error("Error writing to file:", error);
        return { statusCode: 500, body: "Failed to save message" };
    }
};
