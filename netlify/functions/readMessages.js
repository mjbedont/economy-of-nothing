const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    const filePath = path.join("/tmp", "messages.txt");

    try {
        const data = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
        return { statusCode: 200, body: JSON.stringify({ messages: data.split("\n").filter(Boolean) }) };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: "Failed to read messages" };
    }
};
