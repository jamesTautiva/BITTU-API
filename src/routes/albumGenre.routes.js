const router = require('express').Router();
const albumGenreController = require('../controllers/albumGenre.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/:albumId/genres', albumGenreController.getGenresForAlbum);
router.post('/:albumId/genres', authenticate, albumGenreController.addGenreToAlbum);
router.delete('/:albumId/genres/:genreId', authenticate, albumGenreController.removeGenreFromAlbum);

module.exports = router;
