const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes');
const { connectDB } = require('./infrastructure/db');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/', routes);

// Serve React static files
app.use(express.static(path.join(__dirname, 'presentation/build')));

// For any route not handled by API, serve React index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'presentation/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});