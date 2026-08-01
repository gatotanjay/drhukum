<?php
/**
 * Endpoint penerima form konsultasi dari halaman Contact (ContactForm.jsx).
 * Menerima POST JSON, lalu mengirim email via SMTP Hostinger memakai PHPMailer.
 *
 * Cara kerja:
 *  1. Frontend (ContactForm.jsx) melakukan fetch POST ke /api/send-consultation.php
 *  2. Script ini validasi input, lalu kirim email ke tim DrHukum via SMTP
 *  3. Mengembalikan JSON { success: true/false, message: "..." }
 */

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

// --- Load konfigurasi ---
$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server belum dikonfigurasi. Salin config.example.php menjadi config.php dan isi kredensial SMTP.',
    ]);
    exit;
}
$config = require $configPath;

// --- CORS ---
$allowedOrigin = $config['allowed_origin'] ?? '*';
header('Access-Control-Allow-Origin: ' . $allowedOrigin);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// --- Ambil & decode input JSON ---
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Data tidak valid']);
    exit;
}

// --- Helper sanitasi sederhana ---
function clean($value)
{
    return trim(strip_tags((string) ($value ?? '')));
}

$name       = clean($data['name'] ?? '');
$email      = clean($data['email'] ?? '');
$phone      = clean($data['phone'] ?? '');
$subject    = clean($data['subject'] ?? '');
$legalIssue = clean($data['legalIssue'] ?? '');
$message    = clean($data['message'] ?? '');
$urgency    = clean($data['urgency'] ?? 'normal');

// Honeypot anti-spam sederhana (opsional, field tersembunyi di form)
$honeypot = clean($data['website'] ?? '');
if ($honeypot !== '') {
    // Bot terdeteksi, pura-pura sukses supaya bot tidak tahu.
    echo json_encode(['success' => true]);
    exit;
}

// --- Validasi wajib ---
$errors = [];
if ($name === '') $errors[] = 'Nama wajib diisi';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email tidak valid';
if ($message === '') $errors[] = 'Pesan wajib diisi';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

$urgencyLabel = [
    'normal' => 'Normal',
    'urgent' => 'Mendesak',
    'emergency' => 'Darurat',
][$urgency] ?? 'Normal';

// --- Susun isi email ---
$emailBody = "
    <h2>Konsultasi Baru dari Website DrHukum</h2>
    <table cellpadding='6' cellspacing='0' border='0'>
        <tr><td><strong>Nama</strong></td><td>: " . htmlspecialchars($name) . "</td></tr>
        <tr><td><strong>Email</strong></td><td>: " . htmlspecialchars($email) . "</td></tr>
        <tr><td><strong>Telepon</strong></td><td>: " . htmlspecialchars($phone ?: '-') . "</td></tr>
        <tr><td><strong>Bidang Hukum</strong></td><td>: " . htmlspecialchars($legalIssue ?: '-') . "</td></tr>
        <tr><td><strong>Subjek</strong></td><td>: " . htmlspecialchars($subject ?: '-') . "</td></tr>
        <tr><td><strong>Urgensi</strong></td><td>: " . htmlspecialchars($urgencyLabel) . "</td></tr>
    </table>
    <p><strong>Pesan:</strong></p>
    <p>" . nl2br(htmlspecialchars($message)) . "</p>
    <hr>
    <p style='color:#888;font-size:12px;'>Dikirim dari form konsultasi drhukum.id pada " . date('d-m-Y H:i') . " WIB</p>
";

$mail = new PHPMailer(true);

try {
    // --- Konfigurasi SMTP Hostinger ---
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp_username'];
    $mail->Password   = $config['smtp_password'];
    $mail->SMTPSecure = $config['smtp_secure'] === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $config['smtp_port'];
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['to_email'], $config['to_name'] ?? '');
    $mail->addReplyTo($email, $name); // supaya tim bisa langsung "Reply" ke calon klien

    $mail->isHTML(true);
    $mail->Subject = 'Konsultasi Baru: ' . ($subject !== '' ? $subject : $name);
    $mail->Body    = $emailBody;
    $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $emailBody));

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => 'Formulir berhasil dikirim! Tim kami akan menghubungi Anda dalam 24 jam.',
    ]);
} catch (PHPMailerException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Gagal mengirim email. Silakan coba lagi atau hubungi kami via WhatsApp.',
    ]);
    // Untuk debugging di server, aktifkan baris di bawah (jangan aktif di produksi):
    // error_log('Mail error: ' . $mail->ErrorInfo);
}
