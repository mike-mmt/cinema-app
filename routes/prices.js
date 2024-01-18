const express = require("express");
const router = express.Router();
const prices = require("../prices.json");
const verifyJWT = require("../utils/verify-jwt-middleware");

router.get("/", verifyJWT, async (req, res, next) => {
  try {
    return res.status(200).json(prices);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
