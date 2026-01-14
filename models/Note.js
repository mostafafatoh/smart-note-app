const mongoose = require("mongoose");
const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true],
    },
  },
  { timestamps: true }
);

NoteSchema.pre(/find/, function (next) {
  this.populate({ path: "ownerId", select: "name" });
  next()
});
module.exports = mongoose.model("Note", NoteSchema);
