const router = require('express').Router();
const playbackController = require('../controllers/playback.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, playbackController.createPlaybackLog);
router.get('/', authenticate, playbackController.getPlaybackLogs);
// admin or owner can fetch logs for a specific user
router.get('/user/:userId', authenticate, playbackController.getPlaybackLogsForUser);

module.exports = router;
