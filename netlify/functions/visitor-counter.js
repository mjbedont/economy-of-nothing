const fs = require("fs");
const path = require("path");

exports.handler = async () => {
    // Use Netlify's temporary directory
    const filePath = path.join("/tmp", "visitor-count.txt");

    try {
        let count = 0;

        // Check if the file exists and read the count
        if (fs.existsSync(filePath)) {
            count = parseInt(fs.readFileSync(filePath, "utf-8"), 10) || 0;
        }

        // Increment the count
        count++;

        // Write the updated count back to the file
        fs.writeFileSync(filePath, count.toString());

        return {
            statusCode: 200,
            body: count.toString(),
        };
    } catch (error) {
        console.error("Error updating visitor count:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to update visitor count" }),
        };
    }
};

