const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/artists', require('./artist.routes'));
router.use('/albums', require('./album.routes'));
router.use('/songs', require('./song.routes'));
router.use('/comments', require('./comment.routes'));
router.use('/genres', require('./genre.routes'));
router.use('/favorites', require('./favorite.routes'));
router.use('/playlists', require('./playlist.routes'));
router.use('/playlist-songs', require('./playlistSong.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/album-genres', require('./albumGenre.routes'));
router.use('/playback-logs', require('./playback.routes'));
router.use('/supabase', require('./supabase.routes'));
router.use('/debug', require('./debug.routes'));
router.use('/upload', require('./upload.routes'));
router.use('/legal-acceptances', require('./legalAcceptance.routes'));
router.use('/legal-documents', require('./legalDocument.routes'));

module.exports = router;
