const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const {checkVideoAccess} = require('../middleware/checkVideoAccess');

router.post('/videos', videoController.uploadMiddleware, videoController.createVideo);
router.get('/videos', videoController.listVideos);
router.get('/createSession/:generated_url', videoController.startVideoSession);
router.get('/watch/:generated_url', checkVideoAccess, videoController.streamVideo);
router.post('/videos/pause/:time_stamp', checkVideoAccess, videoController.pauseVideo);
router.post('/videos/expire', checkVideoAccess, videoController.expireVideo);

module.exports = router;