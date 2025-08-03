import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ExpiredPage from "./ExpiredPage";

export default function LinkPage({ linkId }) {
  const [video, setVideo] = useState(null);
  const [expired, setExpired] = useState(false);
  const videoRef = useRef();

  useEffect(() => {
    axios
      .get(`/videos/${linkId}`)
      .then((res) => setVideo(res.data))
      .catch(() => setExpired(true));
  }, [linkId]);

  const handleEnded = async () => {
    setExpired(true);
    await axios.post(`/videos/${linkId}/expire`);
  };

  if (expired) return <ExpiredPage />;

  if (!video)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-navy text-white">
        <p>Loading your one glance...</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-navy text-white">
      <h2 className="text-xl font-bold mb-4">{video.title}</h2>
      <video
        ref={videoRef}
        src={video.url}
        autoPlay
        controls={false}
        className="rounded shadow-lg mb-4"
        onEnded={handleEnded}
        style={{ maxWidth: "90vw", maxHeight: "60vh" }}
      />
      <p className="text-gray-400">This video will play once. No rewind, no download.</p>
    </div>
  );
}