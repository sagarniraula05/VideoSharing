const videoService = require('../application/videoService');
const path = require('path');
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const random = Math.floor(Math.random() * 1000000);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${random}_${base}${ext}`);
  }
});
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('file');

exports.createVideo = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;
    if (!file || !title) {
      return res.status(400).json({ error: 'Title and file are required.' });
    }
    const video = await videoService.addVideo({ title, file });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listVideos = async (req, res) => {
  try {
    const videos = await videoService.getVideos();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.startVideoSession = async (req, res) => {
  const { generated_url } = req.params;
  const viewer_ip = req.ip;
  try {
    const video = await videoService.getVideoByURL(generated_url);
    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }
    const {access_token, is_viewed, time_stamp} = await videoService.createViewSession(video.video_id, viewer_ip);
    res.cookie('video_session', {
    access_token: access_token,
    video_id: video.video_id,
    generated_url: generated_url
  }, {
    httpOnly: true, // Prevents JS access
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax', // Adjust as needed
    maxAge: 10 * 60 * 1000 // e.g., 10 minutes
  });

  res.status(200).json({
    message: 'Video session created successfully.',
    is_viewed: is_viewed,
    time_stamp: time_stamp,
  });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.streamVideo = async (req, res) => {
  const { generated_url } = req.params;
  try {
    const video = await videoService.getVideoByURL(generated_url);
    if (!video) {
      return res.status(404).json({ error: 'Video not found.' });
    }
    const videoPath = path.join(__dirname, '../../uploads', video.file_name);
    res.sendFile(videoPath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.pauseVideo = async (req, res) => {
  const { time_stamp } = req.params;
  const session = req.cookies.video_session;

  if (!session) {
    return res.status(403).json({ error: 'Unauthorized access to video' });
  }

  try {
    videoService.updateVideoTimeStamp(session.access_token, time_stamp);
    res.status(200).json({ message: 'Video paused at', time_stamp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.expireVideo = async (req, res) => {
  const session = req.cookies.video_session;
  if (!session) {
    return res.status(403).json({ error: 'Unauthorized access to video' });
  }

  try {
    await videoService.markSessionViewed(session.access_token);
    res.status(200).json({ message: 'Video marked as viewed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}