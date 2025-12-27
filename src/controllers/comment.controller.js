const { Comment, User, Song, Album } = require('../models');

// create comment
exports.createComment = async (req, res) => {
  try {
    const user_id = req.user && req.user.id;
    const { song_id, album_id, content } = req.body;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });
    if (!song_id || !content) return res.status(400).json({ error: 'song_id and content are required' });

    // Optionally verify song exists
    const song = await Song.findByPk(song_id);
    if (!song) return res.status(404).json({ error: 'Song not found' });

    const comment = await Comment.create({ user_id, song_id, album_id, content });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// list comments, optional filter by song_id or album_id
exports.getAllComments = async (req, res) => {
  try {
    const { song_id, album_id } = req.query;
    const where = {};
    if (song_id) where.song_id = song_id;
    if (album_id) where.album_id = album_id;
    const comments = await Comment.findAll({ where });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get comment by id
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete comment (owner or admin)
exports.deleteComment = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (user.role !== 'admin' && user.id !== comment.user_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await comment.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
