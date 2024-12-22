document.addEventListener("DOMContentLoaded", () => {
    const messageForm = document.getElementById("message-form");
    const messageList = document.getElementById("message-list");

    // Fetch messages from the backend
    function fetchMessages() {
        fetch("/.netlify/functions/message-board")
            .then((response) => response.json())
            .then((messages) => {
                console.log("Fetched messages:", messages); // Debug log
                messageList.innerHTML = ""; // Clear the list
                messages.forEach(({ username, message, timestamp }) => {
                    const listItem = document.createElement("li");
                    listItem.innerHTML = `<strong>${username}:</strong> ${message} <br><small>${new Date(timestamp).toLocaleString()}</small>`;
                    messageList.appendChild(listItem);
                });
            })
            .catch((error) => {
                console.error("Failed to fetch messages:", error);
                messageList.innerHTML = "<li>Error loading messages.</li>";
            });
    }

    // Post a new message
    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!username || !message) {
            alert("Both username and message are required!");
            return;
        }

        console.log("Posting message:", { username, message }); // Debug log

        fetch("/.netlify/functions/message-board", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, message }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to post message");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Posted message:", data); // Debug log
                fetchMessages(); // Refresh the message list
                messageForm.reset(); // Clear the form
            })
            .catch((error) => {
                console.error("Failed to post message:", error);
                alert("Failed to post message.");
            });
    });

    // Initial fetch
    fetchMessages();
});
