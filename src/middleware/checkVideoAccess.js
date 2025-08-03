const videoService = require('../application/videoService');

exports.checkVideoAccess = async (req, res, next) => {
  const sessionCookie = req.cookies.video_session;

  if (!sessionCookie || !sessionCookie.access_token) {
    return res.status(403).send('Unauthorized access to video');
  }

  const { access_token } = sessionCookie;
  const result = await videoService.validateSession(access_token);

  if (!result.valid) {
    return res.status(403).send(result.reason);
  }

  req.videoSession = result.session; // Attach to request for next middleware
  next();
}

