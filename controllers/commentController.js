const commentService = require('../services/commentService');

class CommentController {
  handleAddComment(req, res) {
    const comicId = parseInt(req.body.id_komik, 10);
    const userId = req.session.id_user;
    const { isi_komentar } = req.body;

    commentService.addComment(comicId, userId, isi_komentar);
    res.redirect(`/detail/${comicId}`);
  }

  handleDeleteComment(req, res) {
    const commentId = parseInt(req.body.id_komentar, 10);
    const comicId = parseInt(req.body.id_komik, 10);
    const userId = req.session.id_user;
    const isAdmin = req.session.username === 'admin';

    commentService.deleteComment(commentId, userId, isAdmin);
    res.redirect(`/detail/${comicId}?pesan=hapus_komentar_sukses`);
  }
}

module.exports = new CommentController();
