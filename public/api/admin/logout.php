<?php
require __DIR__ . '/../db.php';
require __DIR__ . '/../auth.php';

$config = getConfig();
applyCorsHeaders($config);

startSecureSession();
$_SESSION = [];
session_destroy();

echo json_encode(['success' => true]);
