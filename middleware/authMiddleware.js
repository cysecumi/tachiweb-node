function initSession(req, res, next) {
  if (!req.session.status) {
    req.session.status = 'guest';
    req.session.nama_panggilan = 'Guest';
    req.session.id_user = 0;
    req.session.username = 'guest';
    req.session.role = 'guest';
  }
  
  const nama_user = req.session.nama_panggilan || req.session.username || 'Guest';
  const inisial = (nama_user.charAt(0) || 'G').toUpperCase();
  const userRole = req.session.role || (req.session.username === 'admin' ? 'admin' : 'guest');
  const isAdmin = userRole === 'admin' || req.session.username === 'admin';

  res.locals.currentUser = {
    id_user: req.session.id_user || 0,
    username: req.session.username || '',
    nama_panggilan: nama_user,
    inisial: inisial,
    status: req.session.status || 'guest',
    role: userRole,
    isAdmin: isAdmin
  };

  next();
}

function requireLogin(req, res, next) {
  if (!req.session.status || req.session.status !== 'login') {
    return res.redirect('/login?pesan=akses_ditolak');
  }
  next();
}

function requireAdmin(req, res, next) {
  const isAdmin = (req.session.role === 'admin') || (req.session.username === 'admin');
  if (!req.session.status || req.session.status !== 'login' || !isAdmin) {
    return res.redirect('/login?pesan=akses_ditolak');
  }
  next();
}

module.exports = {
  initSession,
  requireLogin,
  requireAdmin
};
