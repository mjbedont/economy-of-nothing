const fs = require("fs");
const path = require("path");

const filePath = path.join("/tmp", "messages.json");

exports.handler = async (event) => {
    try {
        // Determine HTTP method
        const method = event.httpMethod;

        if (method === "GET") {
            // Fetch messages
            if (fs.existsSync(filePath)) {
                const messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                return {
                    statusCode: 200,
                    body: JSON.stringify(messages),
                };
            } else {
                return {
                    statusCode: 200,
                    body: JSON.stringify([]), // No messages yet
                };
            }
        } else if (method === "POST") {
            // Add a new message
            const { username, message } = JSON.parse(event.body);

            if (!username || !message) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "Both username and message are required." }),
                };
            }

            // Read existing messages
            let messages = [];
            if (fs.existsSync(filePath)) {
                messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            }

            // Add the new message
            const newMessage = { username, message, timestamp: new Date().toISOString() };
            messages.push(newMessage);

            // Write messages back to the file
            fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

            return {
                statusCode: 200,
                body: JSON.stringify(newMessage),
            };
        } else {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: "Method not allowed" }),
            };
        }
    } catch (error) {
        console.error("Error handling messages:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};
const fs = require("fs");
const path = require("path");

const filePath = path.join("/tmp", "messages.json");

exports.handler = async (event) => {
    try {
        // Determine HTTP method
        const method = event.httpMethod;

        if (method === "GET") {
            // Fetch messages
            if (fs.existsSync(filePath)) {
                const messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
                return {
                    statusCode: 200,
                    body: JSON.stringify(messages),
                };
            } else {
                return {
                    statusCode: 200,
                    body: JSON.stringify([]), // No messages yet
                };
            }
        } else if (method === "POST") {
            // Add a new message
            const { username, message } = JSON.parse(event.body);

            if (!username || !message) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "Both username and message are required." }),
                };
            }

            // Read existing messages
            let messages = [];
            if (fs.existsSync(filePath)) {
                messages = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            }

            // Add the new message
            const newMessage = { username, message, timestamp: new Date().toISOString() };
            messages.push(newMessage);

            // Write messages back to the file
            fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));

            return {
                statusCode: 200,
                body: JSON.stringify(newMessage),
            };
        } else {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: "Method not allowed" }),
            };
        }
    } catch (error) {
        console.error("Error handling messages:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};
