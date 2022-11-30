// Import Express.js
const express = require('express');
const path = require('path');
const fs = require('fs');

// import application files
// Import 'db.json' file for use
const dbData = require('./db/db.json');

// define Express app object and TCP/IP port to listen on
const app = express();
const PORT = 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up files in /public (serves up index.html by default)
app.use(express.static('public'));

// Sends the notes.html file when /notes path is used 
// On click of "Get Started" button on index.html, redirect to...
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// Get route to get ALL db entries
app.get('/api/notes1', (req, res) => {
  res.json(dbData)
});

// GET request for reviews
app.get('/api/notes', (req, res) => {

  // Log our request to the terminal
console.info(`${req.method} request received to get notes`);

  // Obtain existing notes
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      //parsedNotes.push(newReview);
      res.json(JSON.parse(data));
    }
  });
});

// GET route that returns any specific entry
// app.get('/api/notes/:title', (req, res) => {
//   // Coerce the specific search term to lowercase
//   const requestedEntry = req.params.title.toLowerCase();

//   // Iterate through the terms name to check if it matches `req.params.title`
//   for (let i = 0; i < dbData.length; i++) {
//     if (requestedEntry === dbData[i].title.toLowerCase()) {
//       return res.json(dbData[i]);
//     }
//   }

//   // Return a message if the term doesn't exist in our DB
//   return res.json('No match found');
// });

// App listens on this port.
app.listen(PORT, () =>
  console.log(`Note Taker app listening at http://localhost:${PORT}`)
);