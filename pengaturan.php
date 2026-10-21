<?php
require_once __DIR__ . '/functions.php';

requireLogin();
$headerTitle = 'Pengaturan - TachiWeb';
include __DIR__ . '/header.php';
$user = currentUser();
?>

<div class="container auth-page">
    <div class="auth-box">
        <h2>Pengaturan</h2>
        <p>Halo, <strong><?= e($user['nama_panggilan']) ?></strong>!</p>
        <p>Username: <strong><?= e($user['username']) ?></strong></p>
        <p>Role: <strong><?= e($user['role']) ?></strong></p>
        <a href="logout.php" class="primary-btn">Logout</a>
    </div>
</div>

<?php include __DIR__ . '/footer.php'; ?>
