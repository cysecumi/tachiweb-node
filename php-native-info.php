<?php
require_once __DIR__ . '/functions.php';

$headerTitle = 'TachiWeb';
include __DIR__ . '/header.php';
?>

<div class="container">
    <h3 class="section-title">PHP Native Version</h3>
    <p>Versi PHP native untuk aplikasi TachiWeb sudah dibuat. Jalankan server melalui:</p>
    <pre>php -S 0.0.0.0:8000</pre>
    <p>Lalu buka <a href="index.php">http://localhost:8000/index.php</a></p>
</div>

<?php include __DIR__ . '/footer.php'; ?>
