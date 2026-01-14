const Slugify = require("slugify");
const { check } = require("express-validator");
const User = require("../models/User");
const valditorMiddelware = require("../middelware/valditorMiddelware");

exports.registervalditor = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("too short name")
    .custom((val, { req }) => {
      req.body.slug = Slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) => {
      return User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail is already is used"));
        }
      });
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("too short password must be at least 6")
    .custom((password, { req }) => {
      if (password != req.body.passwordConfirm) {
        throw new Error("password confirmation incorrect ");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),
  valditorMiddelware,
];

exports.loginvalditor = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("invalid email address"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .bail()
    .isLength({ min: 6 })
    .withMessage("too short password must be at least 6"),
  valditorMiddelware,
];
