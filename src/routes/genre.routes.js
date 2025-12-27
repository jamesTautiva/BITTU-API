const router = require('express').Router();
const genreController = require('../controllers/genre.controller');
const { authenticate } = require('../middleware/auth.middleware');
const {
	validateIdParam,
	validateCreateGenre,
	validateUpdateGenre
} = require('../middleware/validators/genre.validator');

router.get('/', genreController.getAllGenres);
router.get('/:id', validateIdParam, genreController.getGenreById);
router.post('/', authenticate, validateCreateGenre, genreController.createGenre);
router.put('/:id', authenticate, validateIdParam, validateUpdateGenre, genreController.updateGenre);
router.delete('/:id', authenticate, validateIdParam, genreController.deleteGenre);

module.exports = router;
