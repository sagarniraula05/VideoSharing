const { getPool } = require('./db');

async function insertSession({ video_id, access_token, viewer_ip }) {
  const pool = getPool();
  const [result] = await pool.execute(
    `INSERT INTO video_session (video_id, access_token, viewer_ip, created_on, updated_on, expires_on)
     VALUES (?, ?, ?, NOW(), NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY))`,
    [video_id, access_token, viewer_ip]
  );
  return result.insertId;
}

async function getSessionByToken(access_token) {
  const pool = getPool();
  const rows = await pool.execute('SELECT * FROM video_session where access_token = ?', [access_token]);
  return rows[0][0] || null;
}

async function getSessionsByVideoId(video_id) {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM video_session WHERE video_id = ?', [video_id]);
  return rows;
}

async function markViewed(access_token) {
  const pool = getPool();
  const [result] = await pool.execute(
    `UPDATE video_session set is_viewed = true, updated_on = NOW()
     WHERE access_token = ?`,
    [access_token]
  );
  return result.affectedRows > 0;
}

async function updateVideoTimeStamp(access_token, time_stamp) {
  const pool = getPool();
  const [result] = await pool.execute(
    `UPDATE video_session SET viewed_time_stamp = ?, updated_on = NOW()
     WHERE access_token = ?`,
    [time_stamp, access_token]
  );
  return result.affectedRows > 0;
}

module.exports = { insertSession, getSessionByToken, markViewed, getSessionsByVideoId, updateVideoTimeStamp };