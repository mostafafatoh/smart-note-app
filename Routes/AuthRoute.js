const express = require("express");
const {
  register,
  login,
  forgetpassword,
  VerfiyResetCode,
  resetpassword,
} = require("../services/Authservice.js");
const {
  registervalditor,
  loginvalditor,
} = require("../utiles/Authvalditon.js");

const router = express.Router();

router.post("/register", registervalditor, register);
router.post("/login", loginvalditor, login);
router.post("/forgetpassword", forgetpassword);
router.post("/VerfiyResetCode", VerfiyResetCode);
router.patch("/resetpassword", resetpassword);
module.exports = router;
