<?php

require_once __DIR__ . '/functions.php';

// Basic DB helper
function dbConnect(): PDO
{
    $dbPath = __DIR__ . '/data/tachiweb.sqlite';
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $pdo = dbConnect();
    }
    return $pdo;
}

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function redirect(string $path): void
{
    header('Location: ' . $path);
    exit;
}

function currentUser(): array
{
    return [
        'id_user' => (int)($_SESSION['id_user'] ?? 0),
        'username' => $_SESSION['username'] ?? '',
        'nama_panggilan' => $_SESSION['nama_panggilan'] ?? 'Guest',
        'role' => $_SESSION['role'] ?? 'guest',
        'status' => $_SESSION['status'] ?? 'guest',
    ];
}

function requireLogin(): void
{
    if (!isset($_SESSION['status']) || $_SESSION['status'] !== 'login') {
        redirect('login.php?pesan=akses_ditolak');
    }
}

function requireGuest(): void
{
    if (($_SESSION['status'] ?? 'guest') === 'login') {
        redirect('index.php');
    }
}

session_start();
