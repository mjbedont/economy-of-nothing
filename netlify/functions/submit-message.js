const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    const filePath = path.join(__dirname, "../../data/messages.txt");

    if (event.httpMethod === "POST") {
        const message = new URLSearchParams(event.body).get("message");

        if (!message || message.trim() === "") {
            return {
                statusCode: 400,
                body: "Message cannot be empty.",
            };
        }

        try {
            // Append the message to the file
            fs.appendFileSync(filePath, `${message}\n`, "utf8");

            // Read updated messages
            const updatedMessages = fs.readFileSync(filePath, "utf8");

            return {
                statusCode: 200,
                body: updatedMessages,
            };
        } catch (error) {
            console.error("Error writing to file:", error);
            return {
                statusCode: 500,
                body: "Failed to save message.",
            };
        }
    }

    if (event.httpMethod === "GET") {
        try {
            const messages = fs.readFileSync(filePath, "utf8");
            return {
                statusCode: 200,
                body: messages,
            };
        } catch (error) {
            console.error("Error reading file:", error);
            return {
                statusCode: 500,
                body: "Failed to load messages.",
            };
        }
    }

    return {
        statusCode: 405,
        body: "Method Not Allowed.",
    };
};

