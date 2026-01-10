const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const privateKey = fs.readFileSync("./keys/private.key", "utf8");
const publicKey = fs.readFileSync("./keys/public.key", "utf8");
const ApiError = require("../utiles/apierror");
const SendEmail = require("../utiles/SendEmail");
createtoken = (payload) => {
  return jwt.sign({ userId: payload }, privateKey, {
    algorithm: "RS256",
    expiresIn: process.env.EXPIRE_TIME,
  });
};
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = createtoken(user.id);
  res.status(201).json({
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      profileimage: user.profileimage,
    },
    token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  //check if user && password is exist
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("incorrect email or password", 401));
  }

  //generate token
  const token = createtoken(user.id);
  //send response to client side
  res.status(200).json({
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  //1- check if token exist,and get it if exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "you are not logain,please login to access for this route",
        401
      )
    );
  }
  //2- verfiy token
  const decoded = jwt.verify(token, publicKey);
  //3-check if user exist
  const currentuser = await User.findById(decoded.userId);
  if (!currentuser) {
    return next(
      new ApiError('This user no longer belongs to this token", 401')
    );
  }
  //4-check if user changed  his password after created(token)

  if (currentuser.passwordChangedAt) {
    const passwordChangedAtTimeStamp = parseInt(
      currentuser.passwordChangedAt.getTime() / 1000,
      10
    );

    if (passwordChangedAtTimeStamp > decoded.iat) {
      return next(
        new ApiError("User changed password after created token", 401)
      );
    }
  }
  req.user = currentuser;
  next();
});

exports.forgetpassword = asyncHandler(async (req, res, next) => {
  //1-get user by email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user for this email ${req.body.email}`, 404)
    );
  }
  //if user exists ,generate hash reset random 6 digits and save in db
  const resetcode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetcode)
    .digest("hex");
  //save hash reset code into db
  user.passwordHashedResetcode = hashedResetCode;
  //add expired time for reset code
  user.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerifed = false;

  await user.save();
  const message = `HI ${user.name}\n WE received your request to reset password in your account.\n ${resetcode} \n Enter this number to complete your reset.\n Thanks for helping us keep your account secure `;

  //send the reset code via email
  try {
    await SendEmail({
      email: user.email,
      subject: `your password reset code (valid for 15 minute)`,
      message,
    });
  } catch {
    user.passwordHashedResetcode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetVerifed = undefined;
    await user.save();
    return next(new ApiError(`there is error in sending email`, 500));
  }
  res
    .status(200)
    .json({ status: "success", message: "reset code was send to email" });
});

exports.VerfiyResetCode = asyncHandler(async (req, res, next) => {
  //Get User based on resetcode
  const hashedRestcode = crypto
    .createHash("sha256")
    .update(req.body.ResetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordHashedResetcode: hashedRestcode,
    passwordResetCodeExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError(`Reset code is not valide or Expired`));
  }
  user.passwordResetVerifed = true;
  await user.save();

  res.status(200).json({ status: "success" });
});

exports.resetpassword = asyncHandler(async (req, res, next) => {
  //1- Get passsword based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`there is no user with email : ${req.body.email}`, 404)
    );
  }
  if (!user.passwordResetVerifed) {
    return next(new ApiError(`Reset code not verfied`, 400));
  }
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new ApiError("Password confirmation incorrect", 400));
  }

  user.password = req.body.password;
  user.passwordHashedResetcode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordResetVerifed = undefined;
  await user.save();

  //generate new token
  const token = createtoken(user.id);
  res.status(200).json({ token });
});
