<?php
/**
 * Helper koneksi database (PDO + MySQL).
 * Dipakai oleh semua endpoint di folder api/ yang butuh akses database.
 */

function getConfig()
{
    $configPath = __DIR__ . '/config.php';
    if (!file_exists($configPath)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Server belum dikonfigurasi. Salin config.example.php menjadi config.php dan isi kredensialnya.',
        ]);
        exit;
    }
    return require $configPath;
}

function getDb()
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $config = getConfig();

    try {
        $dsn = sprintf(
            'mysql:host=%s;dbname=%s;charset=utf8mb4',
            $config['db_host'],
            $config['db_name']
        );
        $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Gagal konek ke database. Cek kredensial db_* di config.php.',
        ]);
        exit;
    }
}
