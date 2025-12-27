const router = require('express').Router();
const favoriteController = require('../controllers/favorite.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, favoriteController.getFavoritesForUser);
router.post('/', authenticate, favoriteController.addFavorite);
router.delete('/:id', authenticate, favoriteController.deleteFavorite);
router.delete('/song/:songId', authenticate, favoriteController.deleteFavoriteBySong);

module.exports = router;
