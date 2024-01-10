const express = require("express");
const router = express.Router();
const verifyJWT = require("../utils/verify-jwt-middleware");
const Account = require("../models/Account");

router.get("/", verifyJWT, async (req, res, next) => {
  try {
    const account = Account.aggregate()
      .match({ _id: req.user.id })
      .lookup({
        from: "orders",
        localField: "orders",
        foreignField: "_id",
        as: "orders",
      })
      .exec();
    return res.status(200).json(account);
  } catch (error) {
    next(error);
  }
});
