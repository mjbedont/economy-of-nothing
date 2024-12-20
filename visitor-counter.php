<?php
$filePath = __DIR__ . '/data/counters/visitor-count.txt';

if (file_exists($filePath)) {
    $count = (int)file_get_contents($filePath);
    $count++;
    file_put_contents($filePath, $count);
    echo $count;
} else {
    file_put_contents($filePath, 1);
    echo 1;
}
?>
