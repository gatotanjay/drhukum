<?php
/**
 * Endpoint kelola artikel/blog/legal-update/tutorial untuk admin panel.
 *
 * GET  /api/admin/posts.php            -> daftar semua post (draft + published)
 * GET  /api/admin/posts.php?id=5       -> detail 1 post + terjemahan 3 bahasa
 * POST /api/admin/posts.php            -> body: { action: 'create'|'update'|'delete', ... }
 */

require __DIR__ . '/../db.php';
require __DIR__ . '/../auth.php';

$config = getConfig();
applyCorsHeaders($config);
requireAdminAuth();

$pdo = getDb();
$method = $_SERVER['REQUEST_METHOD'];

$LOCALES = ['id', 'en', 'zh'];

function respond($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function clean($v)
{
    return trim((string) ($v ?? ''));
}

// ---------------------------------------------------------------
// GET: list semua post, atau detail 1 post kalau ada ?id=
// ---------------------------------------------------------------
if ($method === 'GET') {
    if (!empty($_GET['id'])) {
        $id = (int) $_GET['id'];

        $stmt = $pdo->prepare('SELECT * FROM posts WHERE id = ?');
        $stmt->execute([$id]);
        $post = $stmt->fetch();

        if (!$post) {
            respond(['success' => false, 'message' => 'Post tidak ditemukan'], 404);
        }

        $stmt = $pdo->prepare('SELECT locale, title, excerpt, content FROM post_translations WHERE post_id = ?');
        $stmt->execute([$id]);
        $translations = [];
        foreach ($stmt->fetchAll() as $row) {
            $translations[$row['locale']] = [
                'title' => $row['title'],
                'excerpt' => $row['excerpt'],
                'content' => $row['content'],
            ];
        }
        $post['translations'] = $translations;

        respond(['success' => true, 'post' => $post]);
    }

    // List semua post (untuk tabel/kartu admin), sertakan judul & ringkasan versi ID sebagai preview
    $stmt = $pdo->query("
        SELECT p.*, pt.title AS title_id, pt.excerpt AS excerpt_id
        FROM posts p
        LEFT JOIN post_translations pt ON pt.post_id = p.id AND pt.locale = 'id'
        ORDER BY p.created_at DESC
    ");
    respond(['success' => true, 'posts' => $stmt->fetchAll()]);
}

// ---------------------------------------------------------------
// POST: create / update / delete (dibedakan lewat field "action")
// ---------------------------------------------------------------
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        respond(['success' => false, 'message' => 'Data tidak valid'], 400);
    }

    $action = $data['action'] ?? '';

    // --- DELETE ---
    if ($action === 'delete') {
        $id = (int) ($data['id'] ?? 0);
        if (!$id) {
            respond(['success' => false, 'message' => 'ID wajib diisi'], 422);
        }
        $stmt = $pdo->prepare('DELETE FROM posts WHERE id = ?');
        $stmt->execute([$id]);
        respond(['success' => true]);
    }

    // --- CREATE / UPDATE ---
    if ($action !== 'create' && $action !== 'update') {
        respond(['success' => false, 'message' => 'action harus create/update/delete'], 422);
    }

    $type = in_array($data['type'] ?? '', ['blog', 'legal_update', 'tutorial', 'sop', 'client_update'], true) ? $data['type'] : null;
    $category = clean($data['category'] ?? '');
    $thumbnail = clean($data['thumbnail'] ?? '');
    $videoUrl = clean($data['video_url'] ?? '');
    $postDate = clean($data['post_date'] ?? '');
    $readTime = clean($data['read_time'] ?? '');
    $author = clean($data['author'] ?? '');
    $featured = !empty($data['featured']) ? 1 : 0;
    $status = in_array($data['status'] ?? '', ['draft', 'published'], true) ? $data['status'] : 'draft';
    $translations = is_array($data['translations'] ?? null) ? $data['translations'] : [];

    // --- Validasi ---
    $errors = [];
    if (!$type) $errors[] = 'Tipe post wajib dipilih';
    // Kategori hanya wajib untuk blog & legal_update; tutorial/sop boleh kosong
    if ($category === '' && in_array($type, ['blog', 'legal_update'], true)) {
        $errors[] = 'Kategori/tag wajib diisi';
    }
    if ($postDate === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $postDate)) $errors[] = 'Tanggal wajib diisi (format YYYY-MM-DD)';

    // Tutorial & SOP: hanya wajib mengisi bahasa Indonesia; EN & ZH akan di-fallback otomatis
    $requiredLocales = in_array($type, ['tutorial', 'sop'], true) ? ['id'] : $LOCALES;
    foreach ($requiredLocales as $locale) {
        $t = $translations[$locale] ?? null;
        if (!$t || clean($t['title'] ?? '') === '' || clean($t['excerpt'] ?? '') === '') {
            $errors[] = "Judul & ringkasan bahasa '$locale' wajib diisi";
        }
    }

    // Untuk tutorial/sop: isi EN & ZH dengan fallback dari ID jika kosong
    if (in_array($type, ['tutorial', 'sop'], true)) {
        $idTrans = $translations['id'] ?? [];
        foreach (['en', 'zh'] as $locale) {
            $t = $translations[$locale] ?? [];
            if (clean($t['title'] ?? '') === '') {
                $translations[$locale]['title']   = $idTrans['title']   ?? '';
                $translations[$locale]['excerpt']  = $idTrans['excerpt']  ?? '';
                $translations[$locale]['content']  = $idTrans['content']  ?? '';
            }
        }
    }

    if (!empty($errors)) {
        respond(['success' => false, 'message' => implode('; ', $errors)], 422);
    }

    try {
        $pdo->beginTransaction();

        if ($action === 'create') {
            $stmt = $pdo->prepare('
                INSERT INTO posts (type, category, thumbnail, video_url, post_date, read_time, author, featured, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ');
            $stmt->execute([$type, $category, $thumbnail ?: null, $videoUrl ?: null, $postDate, $readTime ?: null, $author ?: null, $featured, $status]);
            $postId = (int) $pdo->lastInsertId();
        } else {
            $postId = (int) ($data['id'] ?? 0);
            if (!$postId) {
                $pdo->rollBack();
                respond(['success' => false, 'message' => 'ID wajib diisi untuk update'], 422);
            }
            $stmt = $pdo->prepare('
                UPDATE posts SET type=?, category=?, thumbnail=?, video_url=?, post_date=?, read_time=?, author=?, featured=?, status=?
                WHERE id=?
            ');
            $stmt->execute([$type, $category, $thumbnail ?: null, $videoUrl ?: null, $postDate, $readTime ?: null, $author ?: null, $featured, $status, $postId]);
        }

        $upsertStmt = $pdo->prepare('
            INSERT INTO post_translations (post_id, locale, title, excerpt, content)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE title = VALUES(title), excerpt = VALUES(excerpt), content = VALUES(content)
        ');
        foreach ($LOCALES as $locale) {
            $t = $translations[$locale];
            $upsertStmt->execute([$postId, $locale, clean($t['title']), clean($t['excerpt']), $t['content'] ?? '']);
        }

        $pdo->commit();
        respond(['success' => true, 'id' => $postId]);
    } catch (Exception $e) {
        $pdo->rollBack();
        respond(['success' => false, 'message' => 'Gagal menyimpan post'], 500);
    }
}

respond(['success' => false, 'message' => 'Method not allowed'], 405);
