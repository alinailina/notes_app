const mongoose = require("mongoose");

// Zero-dependency module that loads environment variables from a .env file into process.env.
require("dotenv").config();
const url = process.env.MONGODB_URI;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//   content: 'Mongoose makes Mongo easier!',
//   date: new Date(),
//   important: true,
// })

// note.save().then(result => {
//     console.log(note);
//     console.log('Note saved!')
//     mongoose.connection.close()
// })

// Objects are retrieved from the database with .find() method of the Note model.
Note.find().then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

// The parameter of the method .find() is an object expressing search conditions.
Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
// --> Prints only important notes
