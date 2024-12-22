const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    const filePath = path.join("/tmp", "messages.txt");
    
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { message } = JSON.parse(event.body);

    if (!message) {
        return { statusCode: 400, body: "Message is required" };
    }

    try {
        fs.appendFileSync(filePath, `${message}\n`, "utf8");
        return { statusCode: 200, body: "Message saved successfully" };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: "Failed to save message" };
    }
};
