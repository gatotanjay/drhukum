<?php
/**
 * Endpoint PUBLIK (tidak perlu login) untuk mengambil post yang sudah published.
 * Dipakai oleh halaman Insight.jsx, Articles.jsx & ArticleDetail.jsx di frontend.
 *
 * GET /api/posts.php?type=blog&locale=id           -> daftar post
 * GET /api/posts.php?type=legal_update&locale=en   -> daftar post
 * Optional: &featured=1
 *
 * GET /api/posts.php?id=5&locale=id                -> satu post (untuk halaman detail/"read more")
 */

require __DIR__ . '/db.php';
require __DIR__ . '/auth.php';

$config = getConfig();
applyCorsHeaders($config);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$pdo = getDb();

$locale = in_array($_GET['locale'] ?? '', ['id', 'en', 'zh'], true) ? $_GET['locale'] : 'id';

// Mode detail: ambil satu post by id (dipakai halaman "read more")
if (isset($_GET['id']) && $_GET['id'] !== '') {
    $id = (int) $_GET['id'];

    $stmt = $pdo->prepare("
        SELECT p.id, p.type, p.category, p.thumbnail, p.post_date, p.read_time, p.author, p.featured,
               pt.title, pt.excerpt, pt.content
        FROM posts p
        JOIN post_translations pt ON pt.post_id = p.id AND pt.locale = :locale
        WHERE p.id = :id AND p.status = 'published'
        LIMIT 1
    ");
    $stmt->execute(['locale' => $locale, 'id' => $id]);
    $post = $stmt->fetch();

    if (!$post) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Artikel tidak ditemukan']);
        exit;
    }

    echo json_encode(['success' => true, 'post' => $post]);
    exit;
}

// Mode daftar: ambil semua post published berdasarkan type
$type = in_array($_GET['type'] ?? '', ['blog', 'legal_update'], true) ? $_GET['type'] : 'blog';
$featuredOnly = !empty($_GET['featured']);

$sql = "
    SELECT p.id, p.type, p.category, p.thumbnail, p.post_date, p.read_time, p.author, p.featured,
           pt.title, pt.excerpt, pt.content
    FROM posts p
    JOIN post_translations pt ON pt.post_id = p.id AND pt.locale = :locale
    WHERE p.type = :type AND p.status = 'published'
";
if ($featuredOnly) {
    $sql .= ' AND p.featured = 1';
}
$sql .= ' ORDER BY p.post_date DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute(['locale' => $locale, 'type' => $type]);

echo json_encode(['success' => true, 'posts' => $stmt->fetchAll()]);
