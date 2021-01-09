// console.log("Hello, World!");
// const http = require("http");

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true,
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2019-05-30T18:39:34.091Z",
//     important: false,
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2019-05-30T19:20:14.298Z",
//     important: true,
//   },
// ];

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   // JSON.stringify() method converts a JavaScript object or value to a JSON string
//   response.end(JSON.stringify(notes));
// });

// const PORT = 3001;
// app.listen(PORT);
// console.log(`Server running on port ${PORT}`);

const express = require("express");
const app = express();

// Middleware to parse incoming requests with JSON payloads into JavaScript objects
app.use(express.json());

// Middleware to allow requests from all origins
const cors = require("cors");
app.use(cors());

const Note = require("./models/note");

app.use(express.static("build"));

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true,
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2019-05-30T18:39:34.091Z",
//     important: false,
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2019-05-30T19:20:14.298Z",
//     important: true,
//   },
// ];

app.get("/", (request, response) => {
  response.send("<h1>Note app</h1>");
});

// app.get("/api/notes", (request, response) => {
//   response.json(notes);
// });

app.get("/api/notes", (request, response) => {
  Note.find()
    .then((notes) => {
      response.json(notes);
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send();
      // --> 400 Bad request
    });
});

// app.get("/api/notes/:id", (request, response) => {
//   const id = Number(request.params.id);
//   const note = notes.find((note) => note.id === id);

//   if (note) {
//     response.json(note);
//   } else {
//     response.status(404).end();
//   }
// });

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
        // --> 404 Not found
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "Malformatted id" });
      // --> 400 Bad request
    });
});

// const generateId = () => {
//   const maxId =
//     notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
//   return maxId + 1;
// };

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({
      error: "Content missing",
      // --> 400 Bad request
    });
  }

  // const note = {
  //   content: body.content,
  //   important: body.important || false,
  //   date: new Date(),
  //   id: generateId(),
  // };

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  // notes = notes.concat(note);
  // response.json(note);

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.put("/api/notes/:id", (request, response) => {
  // const id = Number(request.params.id);
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({
      error: "Content missing",
      // --> 400 Bad request
    });
  }

  const updatedNote = {
    content: body.content,
    important: body.important || false,
  };

  // notes = notes.filter((note) => note.id !== id ? note : updatedNote);
  // response.json(updatedNote);

  Note.findByIdAndUpdate(request.params.id, updatedNote, { new: true })
    // ---> By default, the updatedNote parameter receives the original document without the modifications. Optional { new: true } parameter causes the event handler to be called with the new modified document instead of the original.
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "Error updating note" });
      // --> 400 Bad request
    });
});

// app.delete("/api/notes/:id", (request, response) => {
//   const id = Number(request.params.id);
//   notes = notes.filter((note) => note.id !== id);

//   response.status(204).end();
// });

app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
      // --> 204 No Content
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "Error deleting note" });
      // --> 400 Bad request
    });
});

// Middleware to handle requests to unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};
app.use(unknownEndpoint);
// --> Must be the last middleware loaded. Only exception is the error handler which needs to come at the very end, after the unknown endpoints handler.

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

