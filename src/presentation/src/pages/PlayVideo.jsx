import React, { useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import VideoPlayer from "../components/VideoPlayer";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

const PlayVideo = () =>{
    const { generatedUrl } = useParams();
    const [videoSrc, setVideoSrc] = useState(null);
    const [error, setError] = useState(null);
    const [timeStamp, setTimeStamp] = useState(null);

    useEffect(() => {
    axios.get(`/createSession/${generatedUrl}`)
    .then(res=>{
        if (res.data.is_viewed) {
            setError('This video has already been viewed.');
            return;
        }
        else{
          setTimeStamp(res.data.time_stamp);
          setVideoSrc(`/watch/${generatedUrl}`);
      }
    })
    .catch(err => {
        setError(err.response?.data || 'Video expired.');
    });
  }, [generatedUrl]);


  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!videoSrc) {
    return <div>Loading video...</div>;
  }

   return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        bgcolor="#0a1026"
        color="#fff"
        borderRadius={2}
        boxShadow={3}
        p={4}
      >
        <Box sx={{ mb: 2 }}>
                <VideoPlayer
                    src={videoSrc}
                    allowSeek={false}
                    generatedUrl={generatedUrl}
                    timeStamp={timeStamp}
                />
        </Box>
        </Box>
    </Container>
   );
    
}

export default PlayVideo;