<?php
/**
 * Endpoint kelola draft dokumen pekerjaan hukum untuk admin panel.
 *
 * GET  /api/admin/drafts.php           -> daftar semua draft
 * GET  /api/admin/drafts.php?id=5      -> detail 1 draft
 * POST /api/admin/drafts.php           -> body: { action: 'create'|'update'|'delete', ... }
 */

require __DIR__ . '/../db.php';
require __DIR__ . '/../auth.php';

$config = getConfig();
applyCorsHeaders($config);
requireAdminAuth();

$pdo = getDb();
$method = $_SERVER['REQUEST_METHOD'];

$STATUSES = ['proses', 'draft', 'selesai'];

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
// GET: list semua draft, atau detail 1 draft kalau ada ?id=
// ---------------------------------------------------------------
if ($method === 'GET') {
    if (!empty($_GET['id'])) {
        $id = (int) $_GET['id'];

        $stmt = $pdo->prepare('SELECT * FROM drafts WHERE id = ?');
        $stmt->execute([$id]);
        $draft = $stmt->fetch();

        if (!$draft) {
            respond(['success' => false, 'message' => 'Draft tidak ditemukan'], 404);
        }

        respond(['success' => true, 'draft' => $draft]);
    }

    $stmt = $pdo->query('SELECT * FROM drafts ORDER BY updated_at DESC, id DESC');
    respond(['success' => true, 'drafts' => $stmt->fetchAll()]);
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
        $stmt = $pdo->prepare('DELETE FROM drafts WHERE id = ?');
        $stmt->execute([$id]);
        respond(['success' => true]);
    }

    // --- CREATE / UPDATE ---
    if ($action !== 'create' && $action !== 'update') {
        respond(['success' => false, 'message' => 'action harus create/update/delete'], 422);
    }

    $title = clean($data['title'] ?? '');
    $jenis = clean($data['jenis'] ?? '');
    $notes = clean($data['notes'] ?? '');
    $status = in_array($data['status'] ?? '', $STATUSES, true) ? $data['status'] : 'draft';

    $errors = [];
    if ($title === '') $errors[] = 'Judul draft wajib diisi';
    if ($jenis === '') $errors[] = 'Jenis dokumen wajib diisi';
    if (mb_strlen($title) > 255) $errors[] = 'Judul maksimal 255 karakter';
    if (mb_strlen($jenis) > 100) $errors[] = 'Jenis maksimal 100 karakter';

    if (!empty($errors)) {
        respond(['success' => false, 'message' => implode('; ', $errors)], 422);
    }

    if ($action === 'create') {
        $stmt = $pdo->prepare('INSERT INTO drafts (title, jenis, status, notes) VALUES (?, ?, ?, ?)');
        $stmt->execute([$title, $jenis, $status, $notes ?: null]);
        $draftId = (int) $pdo->lastInsertId();
    } else {
        $draftId = (int) ($data['id'] ?? 0);
        if (!$draftId) {
            respond(['success' => false, 'message' => 'ID wajib diisi untuk update'], 422);
        }
        $stmt = $pdo->prepare('UPDATE drafts SET title=?, jenis=?, status=?, notes=? WHERE id=?');
        $stmt->execute([$title, $jenis, $status, $notes ?: null, $draftId]);
    }

    respond(['success' => true, 'id' => $draftId]);
}

respond(['success' => false, 'message' => 'Method not allowed'], 405);
