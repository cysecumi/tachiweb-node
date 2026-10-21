<?php
require_once __DIR__ . '/functions.php';

$headerTitle = 'TachiWeb';
include __DIR__ . '/header.php';
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($headerTitle) ?></title>
    <link rel="stylesheet" href="/assets/style.css">
</head>
<body>
    <header class="site-header">
        <div class="container nav">
            <a class="brand" href="index.php">TachiWeb</a>
            <nav>
                <a href="index.php">Home</a>
                <?php $u = currentUser(); ?>
                <?php if (($u['status'] ?? 'guest') === 'login'): ?>
                    <a href="pengaturan.php"><?= e($u['nama_panggilan']) ?></a>
                    <a href="logout.php">Logout</a>
                <?php else: ?>
                    <a href="login.php">Login</a>
                    <a href="register.php">Register</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>
    
    <main>
