<?php
require_once __DIR__ . '/functions.php';

$pdo = db();
$comicId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

$comic = null;
if ($comicId > 0) {
    $stmt = $pdo->prepare('SELECT * FROM komik WHERE id_komik = ?');
    $stmt->execute([$comicId]);
    $comic = $stmt->fetch();
}

if (!$comic) {
    $comic = [
        'id_komik' => 0,
        'judul' => 'Komik Tidak Ditemukan',
        'author' => 'Unknown',
        'sumber' => 'Asura',
        'tipe' => 'Manga',
        'genre' => '',
        'cover' => 'https://placehold.co/300x450/2c2c2c/bb86fc?text=Not+Found',
        'sinopsis' => 'Maaf, data komik ini tidak tersedia di database.',
    ];
}

$chapterStmt = $pdo->prepare('SELECT * FROM chapter WHERE id_komik = ? ORDER BY nomor_chapter DESC');
$chapterStmt->execute([$comicId ?: 0]);
$chapters = $chapterStmt->fetchAll();

$commentStmt = $pdo->prepare('SELECT c.*, u.nama_panggilan FROM komentar c LEFT JOIN users u ON u.id_user = c.id_user WHERE c.id_komik = ? ORDER BY c.tanggal DESC');
$commentStmt->execute([$comicId ?: 0]);
$comments = $commentStmt->fetchAll();

$headerTitle = ($comic['judul'] ?? 'Detail Komik') . ' - TachiWeb';
include __DIR__ . '/header.php';
?>

<div class="container detail-page">
    <div class="detail-header">
        <img src="<?= e($comic['cover']) ?>" alt="Cover <?= e($comic['judul']) ?>" class="detail-cover" onerror="this.onerror=null;this.src='https://placehold.co/300x450/2c2c2c/bb86fc?text=Cover';">
        <div class="detail-info">
            <h1><?= e($comic['judul']) ?></h1>
            <p><strong>Author:</strong> <?= e($comic['author']) ?></p>
            <p><strong>Sumber:</strong> <?= e($comic['sumber']) ?></p>
            <p><strong>Status:</strong> <?= e($comic['status']) ?></p>
            <p><strong>Tipe:</strong> <?= e($comic['tipe']) ?></p>
            <?php if (!empty($comic['genre'])): ?>
                <p><strong>Genre:</strong> <?= e($comic['genre']) ?></p>
            <?php endif; ?>
            <p><strong>Sinopsis:</strong></p>
            <p><?= nl2br(e($comic['sinopsis'])) ?></p>
        </div>
    </div>

    <div class="section-box">
        <h3>Daftar Chapter</h3>
        <ul class="chapter-list">
            <?php foreach ($chapters as $chapter): ?>
                <li>
                    <a href="baca.php?id=<?= (int)$comic['id_komik'] ?>&ch=<?= (int)$chapter['nomor_chapter'] ?>">
                        Chapter <?= (int)$chapter['nomor_chapter'] ?><?= $chapter['judul_chapter'] ? ' - ' . e($chapter['judul_chapter']) : '' ?>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>

    <div class="section-box">
        <h3>Komentar</h3>
        <?php if ($comments): ?>
            <?php foreach ($comments as $comment): ?>
                <div class="comment-item">
                    <strong><?= e($comment['nama_panggilan'] ?: 'User') ?></strong>
                    <small><?= e($comment['tanggal']) ?></small>
                    <p><?= nl2br(e($comment['isi_komentar'])) ?></p>
                </div>
            <?php endforeach; ?>
        <?php else: ?>
            <p>Belum ada komentar untuk komik ini.</p>
        <?php endif; ?>
    </div>
</div>

<?php include __DIR__ . '/footer.php'; ?>
