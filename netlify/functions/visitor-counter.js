const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    const filePath = path.join("/tmp", "visitor-count.txt"); // Temporary storage

    try {
        let count = 0;

        // Read the visitor count from the file if it exists
        if (fs.existsSync(filePath)) {
            count = parseInt(fs.readFileSync(filePath, "utf-8"), 10);
        }

        // Increment the count
        count++;

        // Write the updated count back to the file
        fs.writeFileSync(filePath, count.toString());

        return {
            statusCode: 200,
            body: JSON.stringify({ visitorCount: count }),
        };
    } catch (error) {
        console.error("Error updating visitor count:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to update visitor count" }),
        };
    }
};