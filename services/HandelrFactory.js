const asyncHandler = require("express-async-handler");
const Apierror = require("../utiles/apierror");

exports.Create = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create({ ...req.body, ownerId: req.user._id });
    res.status(201).json({ data: document });
  });

exports.DeleteNote = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new Apierror(`no note for this id:${id}`, 404));
    }
    if (document.ownerId.toString() !== req.user._id.toString()) {
      return next(
        new Apierror("You are not allowed to perform this action", 403)
      );
    }
    await document.deleteOne();
    res.status(204).send();
  });

exports.getNotes = (Model) =>
  asyncHandler(async (req, res, next) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    const filter = { ownerId: req.user._id };

    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: "i" };
    }

    const document = await Model.find(filter)
      .skip(skip)
      .limit(limit)
      .populate("ownerId", "name email");

    res.status(200).json({
      results: document.length,
      data: document,
    });
  });
