<?php
header('Content-Type: text/plain');
echo "PHP Execution: SUCCESS\n";
echo "REMOTE_ADDR: " . (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'NOT SET') . "\n";
echo "HTTP_X_FORWARDED_FOR: " . (isset($_SERVER['HTTP_X_FORWARDED_FOR']) ? $_SERVER['HTTP_X_FORWARDED_FOR'] : 'NOT SET') . "\n";
echo "HTTP_X_CLIENT_IP: " . (isset($_SERVER['HTTP_X_CLIENT_IP']) ? $_SERVER['HTTP_X_CLIENT_IP'] : 'NOT SET') . "\n";
echo "HTTP_CF_CONNECTING_IP: " . (isset($_SERVER['HTTP_CF_CONNECTING_IP']) ? $_SERVER['HTTP_CF_CONNECTING_IP'] : 'NOT SET') . "\n";
?>
