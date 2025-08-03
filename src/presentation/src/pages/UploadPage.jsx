import React, { useState } from "react";
import axios from "axios";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import VideoPlayer from "../components/VideoPlayer";

const APP_URL = window.location.origin; // Gets current app URL

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setVideoPreviewUrl(URL.createObjectURL(selectedFile));
  }
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
    setVideoPreviewUrl(URL.createObjectURL(droppedFile));
  };

  const validate = () => {
    if (!title.trim()) {
      setError("Title is required.");
      return false;
    }
    if (!file) {
      setError("Video file is required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const res = await axios.post("/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setVideoData(res.data); // Save response to show link
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show link view after upload
  if (videoData) {
    const oneTimeUrl = `${APP_URL}/video/${videoData.generated_url}`;
    return (
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
          bgcolor="#0a1026"
          color="#fff"
          borderRadius={2}
          boxShadow={3}
          p={4}
          mt={8}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Your One-Time Link is Ready!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Share this link. The video will play once, then expire.
          </Typography>
          <Box
            sx={{
              background: "#1a2236",
              color: "#6c63ff",
              p: 2,
              borderRadius: 2,
              wordBreak: "break-all",
              mb: 2,
              width: "100%",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            {oneTimeUrl}
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ background: "#6c63ff", color: "#fff", mt: 2 }}
            onClick={() => navigator.clipboard.writeText(oneTimeUrl)}
          >
            Copy Link
          </Button>
        </Box>
      </Container>
    );
  }

  // Default: show upload form
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
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Upload Your Video
        </Typography>
        <form
          style={{ width: "100%", marginTop: 24 }}
          onSubmit={handleUpload}
          noValidate
        >
          <TextField
            label="Title"
            variant="filled"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              mb: 2,
              input: { color: "#fff" },
              label: { color: "#fff" },
            }}
            InputProps={{
              style: { background: "#1a2236", color: "#fff" },
            }}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{
              background: "#6c63ff",
              color: "#fff",
              mb: 2,
              "&:hover": { background: "#4b47b5" },
            }}
          >
            {file ? "Change Video" : "Choose Video"}
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleFile}
            />
          </Button>
          {videoPreviewUrl && (
            <Box sx={{ mb: 2 }}>
                <VideoPlayer
                    src={videoPreviewUrl}
                    allowSeek={false}
                />
            </Box>
          )}
          {/* {file && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected: {file.name}
            </Typography>
          )} */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              background: "#6c63ff",
              color: "#fff",
              mt: 2,
              "&:hover": { background: "#4b47b5" },
            }}
          >
            {loading ? "Uploading..." : "Generate One-Time Link"}
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </Box>
    </Container>
  );
}