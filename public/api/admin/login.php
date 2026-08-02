<?php
/**
 * Endpoint login admin panel.
 * POST { username, password } -> set session kalau valid.
 */

require __DIR__ . '/../db.php';
require __DIR__ . '/../auth.php';

$config = getConfig();
applyCorsHeaders($config);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = (string) ($data['password'] ?? '');

if ($username === '' || $password === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Username & password wajib diisi']);
    exit;
}

$pdo = getDb();
$stmt = $pdo->prepare('SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1');
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    // Sengaja pesan generik (tidak bilang "username salah" vs "password salah")
    // supaya tidak membantu orang menebak username yang valid.
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Username atau password salah']);
    exit;
}

startSecureSession();
session_regenerate_id(true);
$_SESSION['admin_id'] = $admin['id'];
$_SESSION['admin_username'] = $admin['username'];

echo json_encode([
    'success' => true,
    'admin' => ['id' => $admin['id'], 'username' => $admin['username']],
]);
