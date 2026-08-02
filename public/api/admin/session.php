<?php
/**
 * Dipanggil React admin panel saat pertama kali load untuk cek
 * apakah user masih dalam status login (session masih valid).
 */

require __DIR__ . '/../db.php';
require __DIR__ . '/../auth.php';

$config = getConfig();
applyCorsHeaders($config);
startSecureSession();

if (!empty($_SESSION['admin_id'])) {
    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'admin' => ['id' => $_SESSION['admin_id'], 'username' => $_SESSION['admin_username']],
    ]);
} else {
    echo json_encode(['success' => true, 'authenticated' => false]);
}
