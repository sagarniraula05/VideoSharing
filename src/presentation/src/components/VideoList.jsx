import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VideoList() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get('/videos').then(res => setVideos(res.data));
  }, []);

  return (
    <div>
      <h2>Uploaded Videos</h2>
      <ul>
        {videos.map(video => (
          <li key={video.video_id}>
            <strong>{video.title}</strong> - {video.file_name} <br />
            <a href={`${video.location}/${video.file_name}`} target="_blank" rel="noopener noreferrer">
              Download/Watch
            </a>
            <br />
            Unique URL: {video.generated_url}
          </li>
        ))}
      </ul>
    </div>
  );
}