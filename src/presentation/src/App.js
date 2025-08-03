import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadPage from "./pages/UploadPage";
import LinkPage from "./pages/LinkPage";
import PlayVideo from "./pages/PlayVideo";
import logo from "./assets/logo.png";
import './App.css';

function LinkWrapper() {
  const { linkId } = useParams();
  return <LinkPage linkId={linkId} />;
}

function App() {
  const [started, setStarted] = useState(false);
  const [link, setLink] = useState("");

  return (
    <Router>
      <div className="App">
        <header className="one-glance-header" style={{
          background: "#0a1026",
          color: "#fff",
          padding: "1.5rem 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <img src={logo} alt="One Glance Logo" style={{ width: 80, height: 80, marginBottom: 12 }} />
          <h1 style={{ fontWeight: "bold", fontSize: "2rem", margin: 0 }}>One Glance</h1>
          <p style={{ fontSize: "1.1rem", marginTop: 8, color: "#ffffff" }}>
            Watch it once. That's all you get.
          </p>
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                !started ? (
                  <LandingPage onStart={() => setStarted(true)} />
                ) : (
                  <UploadPage onLink={(url) => setLink(url)} />
                )
              }
            />
            <Route path="/video/:generatedUrl" element={<PlayVideo />} />
            <Route path="/link/:linkId" element={<LinkWrapper />} />
          </Routes>
        </main>
        <footer className="App-footer">
          &copy; {new Date().getFullYear()} One Glance. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;
