<?php
require_once __DIR__ . '/functions.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $username = trim((string)($_POST['username'] ?? ''));
    $password = (string)($_POST['password'] ?? '');
    $namaPanggilan = trim((string)($_POST['nama_panggilan'] ?? ''));

    if ($username === '' || $password === '' || $namaPanggilan === '') {
        redirect('register.php?pesan=isi_data');
    }

    $stmt = db()->prepare('SELECT id_user FROM users WHERE username = ?');
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        redirect('register.php?pesan=username_terpakai');
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $insert = db()->prepare('INSERT INTO users (username, password, nama_panggilan, role) VALUES (?, ?, ?, ?)');
    $insert->execute([$username, $hash, $namaPanggilan, 'user']);

    redirect('login.php?pesan=registrasi_berhasil');
}

$headerTitle = 'Register - TachiWeb';
include __DIR__ . '/header.php';
?>

<div class="container auth-page">
    <div class="auth-box">
        <h2>Register</h2>
        <form method="POST" action="register.php">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="nama_panggilan">Nama Panggilan</label>
                <input type="text" id="nama_panggilan" name="nama_panggilan" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="primary-btn">Daftar</button>
        </form>
        <p>Sudah punya akun? <a href="login.php">Masuk</a></p>
    </div>
</div>

<?php include __DIR__ . '/footer.php'; ?>
