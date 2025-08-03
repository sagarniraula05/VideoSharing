import React, { useEffect, useRef, useState } from "react";

export default function VideoPlayer({ src, allowSeek = false, generatedUrl = null, timeStamp = null }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [hasSeekedToTimestamp, setHasSeekedToTimestamp] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    const updateTime = () => {
        setCurrentTime(video.currentTime)
    };
    const updateDuration = () => {
      setDuration(video.duration);
    }

    const handleCanPlay = () => {
      console.log('Seeking to timestamp:', timeStamp);
      console.log('Video duration:', video.duration);
      console.log('ReadyState:', video.readyState);
      if (timeStamp && !hasSeekedToTimestamp) {
        video.currentTime = timeStamp;
        setCurrentTime(timeStamp);
        setHasSeekedToTimestamp(true);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
      updateAjaxViewed();
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);
    };
  }, [timeStamp, hasSeekedToTimestamp]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (hasEnded && !allowSeek) return;
    if (video.paused) {
        if (hasEnded && allowSeek) {
            video.currentTime = 0;
            setHasEnded(false);
        }
        video.play();
        setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
      updateAjaxPause();
    }
  };

  const updateAjaxPause = async () => {
    if (generatedUrl) {
      try {
        await fetch(`/videos/pause/${currentTime}`, { method: 'POST' });
      } catch (error) {
        console.error('Error pausing video:', error);
      }
    }
  };

  const updateAjaxViewed = async () => {
    if (generatedUrl) {
      try {
        await fetch(`/videos/expire`, { method: 'POST' });
      } catch (error) {
        console.error('Error marking video as viewed:', error);
      }
    }
  }

  const seekBy = (seconds) => {
    const video = videoRef.current;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), video.duration);
  };

  const handleSeekBarChange = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleDoubleTap = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (x < rect.width / 2) {
      seekBy(-10); // Left side = backward
    } else {
      seekBy(10); // Right side = forward
    }
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onClick={togglePlay}
      onDoubleClick={handleDoubleTap}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "640px",
        background: "#000",
        borderRadius: 8,
        overflow: "hidden",
        cursor: hasEnded && !allowSeek ? "not-allowed" : "pointer",
        userSelect: "none",
      }}
    >
      <video
        ref={videoRef}
        src={src}
        style={{ width: "100%", display: "block" }}
      />

      {(!isPlaying && (!hasEnded || (hasEnded && allowSeek))) && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontSize: "60px",
            borderRadius: "50%",
            padding: "12px 16px",
          }}
        >
          ▶
        </div>
      )}

      {allowSeek && (
        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleSeekBarChange}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            appearance: "none",
            height: "6px",
            background: "transparent",
            zIndex: 2,
          }}
        />
      )}
      <div
        style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: `${progressPercent}%`,
            height: "6px",
            backgroundColor: "#6c63ff",
            transition: "width 0.1s linear",
            zIndex: 1,
        }}
        />
    </div>
  );
}
