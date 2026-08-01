<?php
/**
 * SALIN file ini menjadi "config.php" di folder yang sama, lalu isi
 * dengan data akun email Hostinger kamu yang sebenarnya.
 *
 * JANGAN commit config.php ke git (sudah otomatis di-ignore lewat .gitignore).
 * Isi file ini hanya lewat File Manager cPanel/hPanel langsung di server,
 * atau upload manual via FTP/SFTP.
 */

return [
    // Alamat SMTP Hostinger untuk domain kamu.
    // Biasanya: smtp.hostinger.com  (cek di hPanel > Emails > Connect Apps & Devices)
    'smtp_host' => 'smtp.hostinger.com',

    // Port SMTP: 465 untuk SSL (disarankan) atau 587 untuk TLS
    'smtp_port' => 465,
    'smtp_secure' => 'ssl', // 'ssl' untuk port 465, 'tls' untuk port 587

    // Akun email yang dibuat di hPanel Hostinger, contoh: info@drhukum.id
    'smtp_username' => 'info@drhukum.com',

    // Password akun email tersebut (BUKAN password akun hosting Hostinger kamu)
    'smtp_password' => 'pasword',

    // Email pengirim (biasanya sama dengan smtp_username)
    'from_email' => 'info@drhukum.com',
    'from_name' => 'DrHukum Website',

    // Email tujuan yang akan menerima notifikasi konsultasi baru
    // Bisa email yang sama atau email lain, misal: konsultasi@drhukum.id
    'to_email' => 'info@drhukum.com',
    'to_name' => 'Tim DrHukum',

    // Domain frontend kamu (untuk keamanan CORS), contoh: https://drhukum.id
    // Isi "*" kalau mau izinkan semua origin (tidak disarankan untuk produksi)
    'allowed_origin' => 'https://drhukum.com',
];
