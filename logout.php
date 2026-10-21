<?php
require_once __DIR__ . '/functions.php';

$pesan = $_GET['pesan'] ?? '';

if (($user = currentUser())['status'] === 'login') {
    session_unset();
    session_destroy();
}

redirect('index.php');
