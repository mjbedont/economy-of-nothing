
<?php
if (file_exists('messages.txt')) {
    echo json_encode(file('messages.txt', FILE_IGNORE_NEW_LINES));
} else {
    echo json_encode([]);
}
?>
