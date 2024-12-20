document.addEventListener("DOMContentLoaded", () => {
    const messageList = document.getElementById("message-list");
    const messageForm = document.getElementById("message-form");

    // Fetch and display messages
    function loadMessages() {
        fetch("/data/messages/messages.txt")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const messages = data.trim().split("\n").reverse(); // Display newest first
                messageList.innerHTML = messages.map(msg => `<li>${msg}</li>`).join("");
            })
            .catch(error => {
                console.error("Error loading messages:", error);
                messageList.innerHTML = "<li>Error loading messages.</li>";
            });
    }

    // Post a new message
    messageForm.addEventListener("submit", event => {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const message = document.getElementById("message").value.trim();

        if (username && message) {
            const postData = new URLSearchParams({ username, message });

            fetch("/post-message.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: postData
            })
                .then(response => response.text())
                .then(() => {
                    loadMessages();
                    messageForm.reset();
                })
                .catch(error => {
                    console.error("Error posting message:", error);
                });
        }
    });

    loadMessages();
});
