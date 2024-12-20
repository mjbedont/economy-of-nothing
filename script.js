document.addEventListener("DOMContentLoaded", () => {
    const visitorCountElement = document.getElementById("visitor-count");

    // Fetch the visitor count from the serverless function
    fetch("/.netlify/functions/visitor-counter")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            visitorCountElement.textContent = data.visitorCount; // Update the visitor count
        })
        .catch(error => {
            console.error("Error fetching visitor count:", error);
            visitorCountElement.textContent = "Error";
        });
});
