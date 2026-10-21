<?php
require_once __DIR__ . '/functions.php';

$user = currentUser();
$pesan = $_GET['pesan'] ?? '';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $username = trim((string)($_POST['username'] ?? ''));
    $password = (string)($_POST['password'] ?? '');

    if ($username === '' || $password === '') {
        redirect('login.php?pesan=isi_data');
    }

    $stmt = db()->prepare('SELECT * FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $userRow = $stmt->fetch();

    if ($userRow && password_verify($password, $userRow['password'])) {
        $_SESSION['status'] = 'login';
        $_SESSION['id_user'] = (int)$userRow['id_user'];
        $_SESSION['username'] = $userRow['username'];
        $_SESSION['nama_panggilan'] = $userRow['nama_panggilan'];
        $_SESSION['role'] = $userRow['role'];
        redirect('index.php');
    }

    redirect('login.php?pesan=login_gagal');
}

$headerTitle = 'Login - TachiWeb';
include __DIR__ . '/header.php';
?>

<div class="container auth-page">
    <div class="auth-box">
        <h2>Login</h2>
        <?php if ($pesan !== ''): ?>
            <div class="alert"><?= e($pesan) ?></div>
        <?php endif; ?>
        <form method="POST" action="login.php">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="primary-btn">Masuk</button>
        </form>
        <p>Belum punya akun? <a href="register.php">Daftar sekarang</a></p>
    </div>
</div>

<?php include __DIR__ . '/footer.php'; ?>
