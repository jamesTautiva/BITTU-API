const router = require('express').Router();
const playlistController = require('../controllers/playlist.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', playlistController.getAllPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.post('/', authenticate, playlistController.createPlaylist);
router.put('/:id', authenticate, playlistController.updatePlaylist);
router.delete('/:id', authenticate, playlistController.deletePlaylist);

module.exports = router;
