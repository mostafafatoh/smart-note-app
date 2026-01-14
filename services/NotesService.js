const NoteModel = require("../models/Note.js");
const Factory = require("./HandelrFactory");

//@ desc create Note
//@ route post /api/v1/reivews
//@ access private/protected/User

exports.CreateNote = Factory.Create(NoteModel);

//@Delete specific Note
//@router Delete /api/v1/reivews
//access private/protected/user-Note
exports.deleteNote = Factory.DeleteNote(NoteModel);

exports.getNotes = Factory.getNotes(NoteModel);
