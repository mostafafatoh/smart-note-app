const express = require("express");
const {
  register,
  login,
  forgetpassword,
  VerfiyResetCode,
  resetpassword,
  UploadProfileImageupload,
  UpdateProfileImage,
  protect,
} = require("../services/Authservice.js");
const {
  registervalditor,
  loginvalditor,
} = require("../utiles/Authvalditon.js");

const router = express.Router();

router.post("/register", UploadProfileImageupload, registervalditor, register);
router.post("/login", loginvalditor, login);
router.post("/forgetpassword", forgetpassword);
router.post("/VerfiyResetCode", VerfiyResetCode);
router.patch("/resetpassword", resetpassword);
router.patch(
  "/upload-profile-pic",
  protect,
  UploadProfileImageupload,
  UpdateProfileImage
);

module.exports = router;
