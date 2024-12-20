<?php
$filePath = __DIR__ . '/data/messages/messages.txt';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = htmlspecialchars($_POST['username']);
    $message = htmlspecialchars($_POST['message']);
    $timestamp = date('Y-m-d H:i:s');

    $newMessage = "{$timestamp} - {$username}: {$message}\n";

    file_put_contents($filePath, $newMessage, FILE_APPEND);

    echo "Message posted successfully!";
} else {
    echo "Invalid request method!";
}
?>
