<?php
require_once __DIR__ . '/functions.php';

$curr = currentUser();
$greeting = $curr['nama_panggilan'] ?? 'Guest';

$headerTitle = 'TachiWeb';
include __DIR__ . '/header.php';
?>

<?php include __DIR__ . '/footer.php'; ?>
