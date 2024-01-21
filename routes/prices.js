const express = require("express");
const router = express.Router();
const prices = require("../prices.json");

router.get("/", async (req, res, next) => {
  try {
    return res.status(200).json(prices);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
