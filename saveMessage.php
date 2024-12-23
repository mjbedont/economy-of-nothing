<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $message = strip_tags($_POST['message']);
    if (!empty($message)) {
        file_put_contents('messages.txt', $message . PHP_EOL, FILE_APPEND);
        echo "Message saved successfully!";
    } else {
        echo "Message cannot be empty.";
    }
}
?>
