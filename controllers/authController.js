const userService = require('../services/userService');

class AuthController {
  renderLogin(req, res) {
    if (req.session.status === 'login') {
      return res.redirect('/');
    }
    const pesan = req.query.pesan || '';
    res.render('login', {
      title: 'Login - TachiWeb',
      pesan
    });
  }

  async handleLogin(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.redirect('/login?pesan=gagal');
    }

    const user = userService.findByUsername(username);
    if (!user) {
      return res.redirect('/login?pesan=gagal');
    }

    const valid = await userService.verifyPassword(user, password);
    if (!valid) {
      return res.redirect('/login?pesan=gagal');
    }

    req.session.id_user = user.id_user;
    req.session.username = user.username;
    req.session.nama_panggilan = user.nama_panggilan;
    req.session.role = user.role || (user.username === 'admin' ? 'admin' : 'user');
    req.session.status = 'login';

    res.redirect('/');
  }

  renderRegister(req, res) {
    if (req.session.status === 'login') {
      return res.redirect('/');
    }
    const pesan = req.query.pesan || '';
    res.render('register', {
      title: 'Daftar Akun - TachiWeb',
      pesan
    });
  }

  handleRegister(req, res) {
    const { username, nama_panggilan, password, konfirmasi_password } = req.body;

    if (!username || !password) {
      return res.redirect('/register?pesan=data_kosong');
    }

    if (password !== konfirmasi_password) {
      return res.redirect('/register?pesan=password_tidak_sama');
    }

    const result = userService.register({
      username,
      nama_panggilan: nama_panggilan || username,
      password
    });

    if (result.error) {
      return res.redirect(`/register?pesan=${result.error}`);
    }

    // Auto login after registration
    req.session.id_user = result.user.id_user;
    req.session.username = result.user.username;
    req.session.nama_panggilan = result.user.nama_panggilan;
    req.session.role = result.user.role || 'user';
    req.session.status = 'login';

    res.redirect('/?pesan=register_sukses');
  }

  handleLogout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }

  handleGuest(req, res) {
    req.session.status = 'guest';
    req.session.id_user = 0;
    req.session.username = 'guest';
    req.session.nama_panggilan = 'Guest';
    res.redirect('/');
  }

  renderSettings(req, res) {
    const user = userService.findById(req.session.id_user);
    if (!user) {
      return res.redirect('/login');
    }

    res.render('pengaturan', {
      title: 'Pengaturan Profil - TachiWeb',
      user,
      pesan: req.query.pesan || '',
      status: req.query.status || ''
    });
  }

  handleUpdateProfile(req, res) {
    const userId = req.session.id_user;
    const { nama_panggilan } = req.body;

    const updated = userService.updateProfile(userId, { nama_panggilan });
    if (updated) {
      req.session.nama_panggilan = updated.nama_panggilan;
      return res.redirect('/pengaturan?status=sukses_profil');
    }
    res.redirect('/pengaturan?status=gagal_profil');
  }

  handleUpdatePassword(req, res) {
    const userId = req.session.id_user;
    const { password_lama, password_baru, konfirmasi_password } = req.body;

    if (!password_lama || !password_baru || !konfirmasi_password) {
      return res.redirect('/pengaturan?status=data_kosong');
    }

    if (password_baru !== konfirmasi_password) {
      return res.redirect('/pengaturan?status=password_tidak_sama');
    }

    const result = userService.updatePassword(userId, password_lama, password_baru);
    if (result.error) {
      return res.redirect(`/pengaturan?status=${result.error}`);
    }

    res.redirect('/pengaturan?status=sukses_password');
  }
}

module.exports = new AuthController();
