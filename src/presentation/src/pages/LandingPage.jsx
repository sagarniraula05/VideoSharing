import React from "react";
import logo from "../assets/logo.png";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function LandingPage({ onStart }) {
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
        <img
          src={logo}
          alt="One Glance Logo"
          style={{ width: 128, height: 128, marginBottom: 24 }}
        />
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          One Glance
        </Typography>
        <Typography variant="h6" gutterBottom>
          Watch it once. That&apos;s all you get.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          style={{ background: "#6c63ff", marginTop: 32 }}
          onClick={onStart}
        >
          Upload a Video
        </Button>
      </Box>
    </Container>
  );
}