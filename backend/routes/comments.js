const express = require("express");
const router = express.Router();
const verifyJWT = require("../utils/verify-jwt-middleware");
const Comment = require("../models/Comment");
const Account = require("../models/Account");

router.get("/:movieId", verifyJWT, async (req, res, next) => {
  const { movieId } = req.params;
  const comments = await Comment.find({ movieId: movieId }).exec();
  res.status(200).json(comments);
});

router.post("/:movieId", verifyJWT, async (req, res, next) => {
  const { movieId } = req.params;
  const { body } = req.body;
  const comment = await Comment.create(req.body);
  res.status(200).json(comment);
});

router.patch("/:commentId", verifyJWT, async (req, res, next) => {
  const update = {
    ...(req.body.likes && { likes: req.body.likes }),
    ...(req.body.dislikes && { dislikes: req.body.dislikes }),
  };
  const comment = await Comment.updateOne({ id: req.params.commentId }, update);
});

module.exports = router;
