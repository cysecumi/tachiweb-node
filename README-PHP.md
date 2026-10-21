# TachiWeb PHP Native

Versi PHP native dibuat sebagai port dari aplikasi Node.js original.

## Cara jalankan

```bash
php -S 0.0.0.0:8000
```

Lalu buka:

- http://localhost:8000/index.php
- http://localhost:8000/detail.php?id=1
- http://localhost:8000/baca.php?id=1&ch=1

## Catatan

- Database SQLite tetap menggunakan file `data/tachiweb.sqlite`
- Asset CSS tetap dipakai dari `assets/style.css`
- Login/register dan fitur utama sudah dibuat dalam versi PHP
