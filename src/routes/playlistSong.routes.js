const router = require('express').Router();
const playlistSongController = require('../controllers/playlistSong.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/:playlistId/songs', playlistSongController.getSongsInPlaylist);
router.post('/:playlistId/songs', authenticate, playlistSongController.addSongToPlaylist);
router.delete('/:playlistId/songs/:songId', authenticate, playlistSongController.removeSongFromPlaylist);

module.exports = router;
