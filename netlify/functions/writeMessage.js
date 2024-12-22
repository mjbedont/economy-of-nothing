const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed",
        };
    }

    const message = JSON.parse(event.body).message;
    if (!message) {
        return {
            statusCode: 400,
            body: "Message is required",
        };
    }

    const filePath = path.join("/tmp", "messages.txt");

    try {
        fs.appendFileSync(filePath, message + "\n");
        return {
            statusCode: 200,
            body: "Message saved successfully",
        };
    } catch (error) {
        console.error("Error writing to file", error);
        return {
            statusCode: 500,
            body: "Failed to save message",
        };
    }
};
