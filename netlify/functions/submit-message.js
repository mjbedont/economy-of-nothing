const fs = require("fs").promises;
const path = require("path");

exports.handler = async (event) => {
    const filePath = path.join(process.cwd(), "/data/messages.txt");

    if (event.httpMethod === "POST") {
        const message = new URLSearchParams(event.body).get("message");

        if (!message || message.trim() === "") {
            return {
                statusCode: 400,
                body: "Message cannot be empty.",
            };
        }

        try {
            // Append the new message to the file
            await fs.appendFile(filePath, `${message}\n`, "utf8");

            // Read the updated file content
            const updatedMessages = await fs.readFile(filePath, "utf8");

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "text/plain",
                },
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
            // Read the content of the messages file
            const messages = await fs.readFile(filePath, "utf8");

            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "text/plain",
                },
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


