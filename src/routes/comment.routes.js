const router = require('express').Router();
const commentController = require('../controllers/comment.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', commentController.getAllComments);
router.get('/:id', commentController.getCommentById);
router.post('/', authenticate, commentController.createComment);
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
