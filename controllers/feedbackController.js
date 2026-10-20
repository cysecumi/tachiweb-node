const feedbackService = require('../services/feedbackService');

class FeedbackController {
  renderFeedback(req, res) {
    const status = req.query.status || '';
    res.render('feedback', {
      title: 'Kirim Feedback - TachiWeb',
      status
    });
  }

  handleCreateFeedback(req, res) {
    const userId = req.session.id_user;
    const { isi_feedback } = req.body;

    feedbackService.addFeedback(userId, isi_feedback);
    res.redirect('/feedback?status=sukses');
  }
}

module.exports = new FeedbackController();
