<?php
/**
 * Endpoint upload thumbnail. Terima multipart/form-data dengan field "thumbnail".
 * Simpan ke public/uploads/thumbnails/, kembalikan URL relatif.
 */

require __DIR__ . '/../db.php';
require __DIR__ . '/../auth.php';

$config = getConfig();
applyCorsHeaders($config);
requireAdminAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

if (empty($_FILES['thumbnail']) || $_FILES['thumbnail']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'File thumbnail tidak ditemukan atau gagal diupload']);
    exit;
}

$file = $_FILES['thumbnail'];

// --- Validasi tipe file (cek MIME asli, bukan cuma dari nama file) ---
$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!isset($allowedTypes[$mimeType])) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF.']);
    exit;
}

// --- Validasi ukuran (maks 5MB) ---
$maxSize = 5 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Ukuran file maksimal 5MB']);
    exit;
}

// --- Simpan dengan nama unik ---
$uploadDir = __DIR__ . '/../../uploads/thumbnails';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$ext = $allowedTypes[$mimeType];
$filename = uniqid('thumb_', true) . '.' . $ext;
$destination = $uploadDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan file di server']);
    exit;
}

echo json_encode([
    'success' => true,
    'url' => '/uploads/thumbnails/' . $filename,
]);
