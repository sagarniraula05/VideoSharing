const videoRepository = require('../infrastructure/videoRepository');
const sessionRepository = require('../infrastructure/sessionRepository');
const Video = require('../domain/Video');
const crypto = require('crypto');
const path = require('path');
const { time } = require('console');

function generateToken(length = 16) {
  return crypto.randomBytes(length).toString('hex');
}

async function addVideo({ title, file }) {
  // File info from multer
  const location = '/uploads'; // relative or absolute as per your server setup
  const file_name = file.filename;
  // Generate a unique URL
  const generated_url = crypto.randomBytes(8).toString('hex');
  const video_id = await videoRepository.insertVideo({
    title,
    location,
    file_name,
    generated_url
  });
  return new Video({
    video_id,
    title,
    location,
    file_name,
    generated_url,
    uploadedAt: new Date()
  });
}


async function getVideoByURL(generated_url) {
  const row = await videoRepository.getVideoByURL(generated_url);
  if (!row) return null;
  return new Video(row);
}

async function getVideos() {
  const rows = await videoRepository.getAllVideos();
  return rows.map(row => new Video(row));
}


async function createViewSession(video_id, viewer_ip) {
  var sessions = await sessionRepository.getSessionsByVideoId(video_id);
  const existingSession = sessions.find(session => session.viewer_ip === viewer_ip);
  if (existingSession) {
    return {access_token : existingSession.access_token, is_viewed: existingSession.is_viewed, time_stamp: existingSession.viewed_time_stamp};
  }

  // Generate a new access token
  const access_token = generateToken(16);

  await sessionRepository.insertSession({
    video_id,
    access_token,
    viewer_ip
  });

  return {access_token, is_viewed: false, time_stamp: null};
}

// Validate a token: check if video is already viewed or expired
async function validateSession(access_token) {
  const session = await sessionRepository.getSessionByToken(access_token);
  if (!session) return { valid: false, reason: 'Invalid token' };

  if (session.is_viewed && !session.allowReplay) {
    return { valid: false, reason: 'Already viewed' };
  }

  if (session.expires_at && new Date() > new Date(session.expires_at)) {
    return { valid: false, reason: 'Expired' };
  }

  return { valid: true, session };
}

// Mark session as viewed
async function markSessionViewed(access_token) {
  return sessionRepository.markViewed(access_token);
}

async function updateVideoTimeStamp(access_token, time_stamp) {
  const updated = await sessionRepository.updateVideoTimeStamp(access_token, time_stamp);
  if (!updated) {
    throw new Error('Failed to update video timestamp');
  }

  return { success: true, time_stamp };
}

module.exports = {
  addVideo,
  getVideoByURL,
  getVideos,
  createViewSession,
  validateSession,
  markSessionViewed,
  updateVideoTimeStamp
};