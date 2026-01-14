const express = require("express");

const { CreateNote, deleteNote,getNotes } = require("../services/NotesService");
const { CreateValdition, deleteValdition } = require("../utiles/NoteValditor");

const Authservice = require("../services/Authservice");
const router = express.Router();
router.use(Authservice.protect);
router.post("/", CreateValdition, CreateNote);
router.get("/", getNotes);
router.delete("/:id", deleteValdition, deleteNote);

module.exports = router;
