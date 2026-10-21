<?php
require_once __DIR__ . '/functions.php';

$pdo = db();
$comicId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$chapterNum = isset($_GET['ch']) ? (int)$_GET['ch'] : 1;

$comic = null;
if ($comicId > 0) {
    $stmt = $pdo->prepare('SELECT * FROM komik WHERE id_komik = ?');
    $stmt->execute([$comicId]);
    $comic = $stmt->fetch();
}

if (!$comic) {
    require __DIR__ . '/header.php';
    echo '<div class="container"><div class="kosong">Komik tidak ditemukan.</div></div>';
    require __DIR__ . '/footer.php';
    exit;
}

$chapter = $pdo->prepare('SELECT * FROM chapter WHERE id_komik = ? AND nomor_chapter = ?');
$chapter->execute([$comicId, $chapterNum]);
$chapterRow = $chapter->fetch();

if (!$chapterRow) {
    $chapterNum = 1;
    $chapter->execute([$comicId, $chapterNum]);
    $chapterRow = $chapter->fetch();
}

$pages = [];
if ($chapterRow) {
    $pageStmt = $pdo->prepare('SELECT * FROM halaman_komik WHERE id_chapter = ? ORDER BY nomor_halaman ASC');
    $pageStmt->execute([$chapterRow['id_chapter']]);
    $pages = $pageStmt->fetchAll();
}

$prevExists = false;
$nextExists = false;

if ($chapterRow) {
    $prevStmt = $pdo->prepare('SELECT id_chapter FROM chapter WHERE id_komik = ? AND nomor_chapter = ?');
    $prevStmt->execute([$comicId, $chapterNum - 1]);
    $prevExists = (bool)$prevStmt->fetch();

    $nextStmt = $pdo->prepare('SELECT id_chapter FROM chapter WHERE id_komik = ? AND nomor_chapter = ?');
    $nextStmt->execute([$comicId, $chapterNum + 1]);
    $nextExists = (bool)$nextStmt->fetch();
}

$headerTitle = 'Baca ' . $comic['judul'] . ' - Chapter ' . $chapterNum . ' - TachiWeb';
include __DIR__ . '/header.php';
?>

<div class="container baca-page">
    <div class="reader-header">
        <h2><?= e($comic['judul']) ?></h2>
        <p>Chapter <?= (int)$chapterNum ?><?= $chapterRow && !empty($chapterRow['judul_chapter']) ? ' - ' . e($chapterRow['judul_chapter']) : '' ?></p>
        <div class="reader-nav">
            <?php if ($prevExists): ?>
                <a href="baca.php?id=<?= (int)$comicId ?>&ch=<?= (int)($chapterNum - 1) ?>">← Previous</a>
            <?php endif; ?>
            <a href="detail.php?id=<?= (int)$comicId ?>">Kembali ke Detail</a>
            <?php if ($nextExists): ?>
                <a href="baca.php?id=<?= (int)$comicId ?>&ch=<?= (int)($chapterNum + 1) ?>">Next →</a>
            <?php endif; ?>
        </div>
    </div>

    <?php if ($pages): ?>
        <?php foreach ($pages as $page): ?>
            <img src="<?= e($page['url_gambar']) ?>" alt="Halaman <?= (int)$page['nomor_halaman'] ?>" class="reader-page" onerror="this.onerror=null;this.src='https://placehold.co/900x1200/2c2c2c/bb86fc?text=Page';">
        <?php endforeach; ?>
    <?php else: ?>
        <div class="kosong">Halaman tidak tersedia untuk chapter ini.</div>
    <?php endif; ?>
</div>

<?php include __DIR__ . '/footer.php'; ?>
