const { check } = require("express-validator");
const valditorMiddelware = require("../middelware/valditorMiddelware");
const Note = require("../models/Note");
exports.CreateValdition = [
  check("title").notEmpty().withMessage("title of note is reuired"),
  check("content").notEmpty().withMessage("content of Note is required"),
  valditorMiddelware,
];

exports.deleteValdition = [
  check("id").isMongoId().withMessage("invalid Note id format"),
  valditorMiddelware,
];
