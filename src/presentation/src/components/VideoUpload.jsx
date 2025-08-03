import React, { useState } from 'react';
import axios from 'axios';

export default function VideoUpload({ onUpload }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setMessage('Title and file are required.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
      await axios.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Upload successful!');
      setTitle('');
      setFile(null);
      if (onUpload) onUpload();
    } catch (err) {
      setMessage('Upload failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload Video</h2>
      <input
        type="text"
        placeholder="Video Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="file"
        accept="video/*"
        onChange={e => setFile(e.target.files[0])}
      />
      <button type="submit">Upload</button>
      {message && <div>{message}</div>}
    </form>
  );
}