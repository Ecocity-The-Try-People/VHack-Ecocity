const express = require('express');
const favicon = require('public/ecoIcon.jpg');
const path = require('public/ecoIcon');

const app = express();
const port = 3000;

// Serve the favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Define a route for the root page
app.get('/', (req, res) => {
    res.send('Hello, this is the root page!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});