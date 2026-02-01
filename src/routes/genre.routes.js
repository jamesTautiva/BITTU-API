const router = require('express').Router();
const genreController = require('../controllers/genre.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/create', authenticate, genreController.createGenre);
router.get('/get-all', genreController.getAllGenres);
router.get('/metal-subgenres', genreController.getMetalSubgenres);
router.post('/initialize-metal', authenticate, genreController.initializeMetalGenres);
router.get('/get/:id', genreController.getGenreById);
router.put('/update/:id', authenticate, genreController.updateGenre);
router.delete('/delete/:id', authenticate, genreController.deleteGenre);

module.exports = router;
