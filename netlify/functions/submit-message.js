const fs = require("fs").promises;
const filePath = "/tmp/messages.txt";

exports.handler = async (event) => {
    if (event.httpMethod === "POST") {
        const message = new URLSearchParams(event.body).get("message");

        if (!message || message.trim() === "") {
            return {
                statusCode: 400,
                body: "Message cannot be empty.",
            };
        }

        try {
            // Ensure the file exists before appending
            try {
                await fs.access(filePath); // Check if the file exists
            } catch (err) {
                await fs.writeFile(filePath, "", "utf8"); // Create an empty file if it doesn't exist
            }

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
            // Read messages from the file
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
