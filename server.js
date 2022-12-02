// Import Express.js
const express = require('express');
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

// import application files
// Import 'db.json' file for use
const dbData = require('./db/db.json');

// define Express app object and TCP/IP port to listen on
const app = express();
// const PORT = 3001;
const port = process.env.PORT || 3001

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up files in /public (serves up index.html by default)
// This route is required to load of db.json entries into HTML elements on notes.html page. It does not work if this is commented out.
app.use(express.static('public'));

// Sends the index.html file when the base / path is used 
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Sends the notes.html file when /notes path is used 
// On click of "Get Started" button on index.html, redirect to...
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// GET request for texts
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
      res.json(JSON.parse(data));
    }
  });
});

// POST request to add a text
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a text`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    // Obtain existing texts
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
        console.log(parsedNotes)
        // Add a new text
        parsedNotes.push(newNote);

        // Write updated texts back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated texts!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting text');
  }
});

// TODO: WORK IN PROGRESS - DELETE request to add a text
// app.get('/api/notes/:note_id', (req, res) => {

//   // Load search term to const
//   const noteId = req.params.note_id;
  
//   // Obtain matching note(s)
//   fs.readFile('./db/db.json', 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//     } else if (noteId) {
//       // Convert string into JSON object
//       const parsedNotes = JSON.parse(data);
//       const nonMatchNotes = [];

//       for (let i = 0; i < parsedNotes.length; i++) {
//         if (parsedNotes[i].note_id !== noteId) {
//           nonMatchNotes.push(parsedNotes[i]);
//         }
//       }
//       console.log(nonMatchNotes);
//       // res.json(JSON.parse(data));
//     }
//   });


// });

// app.delete('/api/notes/:note_id', (req, res) => {
//   // Log that a POST request was received
//   console.info(`${req.method} request received to delete a note`);

//   // Destructuring assignment for the items in req.body
//   const { title, text, note_id } = req.body;

//   // If all the required properties are present
//   if (title && text && note_id) {
//     // Variable for the object we will delete
//     const deleteId = {
//       title,
//       text,
//       note_id: uuid(),
//     };

//     // Obtain existing texts
//     fs.readFile('./db/db.json', 'utf8', (err, data) => {
//       if (err) {
//         console.error(err);
//       } else {
//         // Convert string into JSON object
//         const parsedNotes = JSON.parse(data);
//         console.log(parsedNotes)
//         // Add a new text
//         parsedNotes.push(newNote);

//         // Write updated texts back to the file
//         fs.writeFile(
//           './db/db.json',
//           JSON.stringify(parsedNotes, null, 4),
//           (writeErr) =>
//             writeErr
//               ? console.error(writeErr)
//               : console.info('Successfully deleted texts!')
//         );
//       }
//     });

//     const response = {
//       status: 'success',
//       body: newNote,
//     };

//     console.log(response);
//     res.status(201).json(response);
//   } else {
//     res.status(500).json('Error in deleting text');
//   }
// });

// App listens on this port.
app.listen(PORT, () =>
  console.log(`Note Taker app listening at http://localhost:${PORT}`)
);