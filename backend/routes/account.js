const express = require("express");
const router = express.Router();
const verifyJWT = require("../utils/verify-jwt-middleware");
const Account = require("../models/Account");
const { default: mongoose } = require("mongoose");

router.get("/", verifyJWT, async (req, res, next) => {
  try {
    const account = await Account.findById(req.user.id)
      .populate({
        path: "orders",
        populate: {
          path: "screeningId",
          populate: { path: "movieId", select: "title" },
          select: "_id date movieId sound type",
        },
        select: "_id paid price screeningId seats",
      })
      .select("firstName lastName email isAdmin orders")
      .exec();
    return res.status(200).json(account);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
