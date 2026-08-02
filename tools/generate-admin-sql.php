<?php
/**
 * Script ini HANYA dijalankan LOKAL di komputer kamu, JANGAN pernah diupload ke server.
 * Fungsinya: generate perintah SQL untuk membuat akun admin, dengan password
 * yang sudah di-hash aman (bcrypt) — supaya password asli tidak pernah
 * tersimpan mentah di mana pun, termasuk di database.
 *
 * Cara pakai:
 *   php tools/generate-admin-sql.php
 *   (nanti akan ditanya username & password, lalu keluar perintah SQL siap-pakai)
 */

echo "=== Generate Akun Admin DrHukum ===\n\n";

echo "Username: ";
$username = trim(fgets(STDIN));

echo "Password: ";
$password = trim(fgets(STDIN));

if ($username === '' || $password === '') {
    echo "\nUsername dan password tidak boleh kosong.\n";
    exit(1);
}

if (strlen($password) < 8) {
    echo "\nPeringatan: password sebaiknya minimal 8 karakter.\n";
}

$hash = password_hash($password, PASSWORD_BCRYPT);
$escapedUsername = addslashes($username);

echo "\n✅ Jalankan SQL berikut di phpMyAdmin (hPanel > Databases > phpMyAdmin):\n\n";
echo "INSERT INTO admins (username, password_hash) VALUES ('{$escapedUsername}', '{$hash}');\n\n";
echo "Ulangi script ini sekali lagi untuk membuat akun admin ke-2.\n";
