// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const messageForm = document.getElementById("message-form");
    const messageList = document.getElementById("message-list");

    // Handle form submission
    messageForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent form from reloading the page

        // Get user input
        const username = document.getElementById("username").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validate input
        if (!username || !message) {
            alert("Both fields are required!");
            return;
        }

        // Create a new list item for the message
        const listItem = document.createElement("li");
        listItem.innerHTML = `<strong>${username}:</strong> ${message}`;

        // Append the message to the message list
        messageList.appendChild(listItem);

        // Reset the form
        messageForm.reset();
    });
});
