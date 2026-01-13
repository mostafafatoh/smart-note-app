const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },
    profileimage: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "too short password"],
      select: false,
    },
    passwordChangedAt: Date,
    passwordHashedResetcode: String,
    passwordResetCodeExpires: Date,
    passwordResetVerifed: Boolean,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);
UserSchema.virtual("notes", {
  ref: "Note",
  foreignField: "ownerId",
  localField: "_id",
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
