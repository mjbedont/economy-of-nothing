document.addEventListener("DOMContentLoaded", () => {
    const visitorCountElement = document.getElementById("visitor-count");

    // Fetch and update visitor count
    fetch("/data/counters/visitor-count.txt", { method: "GET" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            visitorCountElement.textContent = data.trim();
        })
        .catch(error => {
            console.error("Error fetching visitor count:", error);
            visitorCountElement.textContent = "Unable to load visitor count.";
        });
});
