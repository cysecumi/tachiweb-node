<?php

require_once __DIR__ . '/functions.php';

$pdo = db();

$cari = trim((string)($_GET['cari'] ?? ''));
$status = trim((string)($_GET['status'] ?? ''));
$sumber = trim((string)($_GET['sumber'] ?? ''));

$query = 'SELECT * FROM komik';
$params = [];
$conditions = [];

if ($cari !== '') {
    $conditions[] = '(LOWER(judul) LIKE ? OR LOWER(author) LIKE ? OR LOWER(genre) LIKE ?)';
    $term = '%' . strtolower($cari) . '%';
    $params[] = $term;
    $params[] = $term;
    $params[] = $term;
}

if ($status !== '') {
    $conditions[] = 'LOWER(status) = LOWER(?)';
    $params[] = $status;
}

if ($sumber !== '') {
    $conditions[] = 'LOWER(sumber) = LOWER(?)';
    $params[] = $sumber;
}

if ($conditions) {
    $query .= ' WHERE ' . implode(' AND ', $conditions);
}

$query .= ' ORDER BY id_komik DESC';
$stmt = $pdo->prepare($query);
$stmt->execute($params);
$komikList = $stmt->fetchAll(PDO::FETCH_ASSOC);

$sourceStmt = $pdo->query("SELECT DISTINCT sumber FROM komik WHERE sumber IS NOT NULL AND sumber != '' ORDER BY sumber ASC");
$daftarSumber = $sourceStmt->fetchAll(PDO::FETCH_COLUMN);

$headerTitle = 'TachiWeb - Baca Komik Online';
include __DIR__ . '/header.php';
?>

<div class="container">
    <h3 class="section-title">Latest Updates</h3>

    <form method="GET" action="index.php" class="filter-bar">
        <input type="text" name="cari" placeholder="Cari judul, author, atau genre..." value="<?= e($cari) ?>">
        <select name="status">
            <option value="">Semua Status</option>
            <option value="Ongoing" <?= $status === 'Ongoing' ? 'selected' : '' ?>>Ongoing</option>
            <option value="Completed" <?= $status === 'Completed' ? 'selected' : '' ?>>Completed</option>
        </select>
        <select name="sumber">
            <option value="">Semua Sumber</option>
            <?php foreach ($daftarSumber as $source): ?>
                <option value="<?= e($source) ?>" <?= $sumber === $source ? 'selected' : '' ?>><?= e($source) ?></option>
            <?php endforeach; ?>
        </select>
        <button type="submit">🔍 Cari</button>
        <?php if ($cari !== '' || $status !== '' || $sumber !== ''): ?>
            <a href="index.php" class="filter-reset">✖ Reset</a>
        <?php endif; ?>
    </form>

    <?php if ($cari !== '' || $status !== '' || $sumber !== ''): ?>
        <p class="filter-info">Menampilkan <?= count($komikList) ?> komik</p>
    <?php endif; ?>

    <?php if (count($komikList) === 0): ?>
        <div class="kosong">😕 Komik tidak ditemukan. Coba kata kunci atau filter lain.</div>
    <?php endif; ?>

    <div class="comic-grid">
        <?php foreach ($komikList as $komik):
            $tipe = trim((string)($komik['tipe'] ?? 'Manga'));
            $bendera = '🇯🇵';
            $classTipe = 'type-manga';

            if ($tipe === 'Manhwa') {
                $bendera = '🇰🇷';
                $classTipe = 'type-manhwa';
            } elseif ($tipe === 'Manhua') {
                $bendera = '🇨🇳';
                $classTipe = 'type-manhua';
            }
        ?>
            <a href="detail.php?id=<?= (int)$komik['id_komik'] ?>" style="text-decoration: none; color: inherit;">
                <div class="comic-card">
                    <span class="comic-badge"><?= e($komik['sumber']) ?></span>
                    <span class="comic-type-badge <?= $classTipe ?>"><?= $bendera ?> <?= e($tipe) ?></span>
                    <img src="<?= e($komik['cover']) ?>" alt="Cover <?= e($komik['judul']) ?>" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/300x450/2c2c2c/bb86fc?text=Cover';">
                    <div class="comic-info">
                        <div class="comic-title"><?= e($komik['judul']) ?></div>
                        <div class="comic-meta">
                            <span><?= e($komik['status']) ?></span>
                            <?php if (!empty($komik['author'])): ?>
                                <span style="opacity:0.8;"><?= e($komik['author']) ?></span>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </a>
        <?php endforeach; ?>
    </div>
</div>

<?php include __DIR__ . '/footer.php'; ?>
