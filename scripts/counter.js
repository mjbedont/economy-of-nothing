document.addEventListener("DOMContentLoaded", () => {
    const visitorCountElement = document.getElementById("visitor-count");

    // Fetch and update visitor count
    fetch("/data/counters/visitor-count.txt", { method: "POST" })
        .then(response => response.text())
        .then(data => {
            visitorCountElement.textContent = data.trim();
        })
        .catch(error => {
            console.error("Error fetching visitor count:", error);
            visitorCountElement.textContent = "Error";
        });
});
