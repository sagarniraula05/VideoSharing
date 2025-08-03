import React, { useState } from 'react';
import VideoUpload from '../components/VideoUpload';
import VideoList from '../components/VideoList';

export default function HomePage() {
  const [refresh, setRefresh] = useState(false);

  const handleUpload = () => setRefresh(r => !r);

  return (
    <div>
      <VideoUpload onUpload={handleUpload} />
      {/* Key forces re-mount to refresh list */}
      <VideoList key={refresh} />
    </div>
  );
}