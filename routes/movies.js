const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const Screening = require("../models/Screening");
const verifyJWT = require("../utils/verify-jwt-middleware");

router.get("/", verifyJWT, async (req, res, next) => {
  try {
    const allMovies = await Movie.find()
      .where("isCurrentlyScreening")
      .equals(true)
      .select("_id title genres mainPhotoUrl")
      .exec();
    return res.status(200).json(allMovies);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
