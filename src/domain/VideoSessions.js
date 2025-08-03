class VideoSessions {
  constructor({ video_session_id, video_id, viewer_ip, access_token, expires_on, created_on, updated_on, is_viewed, viewed_time_stamp}) {
    this.video_session_id = video_session_id;
    this.video_id = video_id;
    this.viewer_ip = viewer_ip;
    this.access_token = access_token;
    this.expires_on = expires_on;
    this.created_on = created_on;
    this.updated_on = updated_on;
    this.is_viewed = is_viewed;
    this.viewed_time_stamp = viewed_time_stamp;
  }
}

module.exports = VideoSessions;