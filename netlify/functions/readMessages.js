const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    const filePath = path.join(__dirname, "messages.json");

    try {
        // Read and parse messages
        const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : '{"messages":[]}';
        const json = JSON.parse(data);

        return {
            statusCode: 200,
            body: JSON.stringify({ messages: json.messages }),
        };
    } catch (error) {
        console.error("Error reading file:", error);
        return { statusCode: 500, body: "Failed to read messages" };
    }
};
