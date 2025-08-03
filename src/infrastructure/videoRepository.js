const { getPool } = require('./db');

async function insertVideo({ title, location, file_name, generated_url }) {
  const pool = getPool();
  const [result] = await pool.execute(
    `INSERT INTO videos (title, location, file_name, generated_url, uploadedAt)
     VALUES (?, ?, ?, ?, NOW())`,
    [title, location, file_name, generated_url]
  );
  return result.insertId;
}

async function getVideoByURL(url) {
  const pool = getPool();
  const rows = await pool.execute('SELECT * FROM videos where generated_url = ?', [url]);
  if (rows?.length === 0) return null;
  return rows[0][0];
}

async function getAllVideos() {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT * FROM videos');
  return rows;
}

module.exports = { insertVideo,getAllVideos,getVideoByURL };