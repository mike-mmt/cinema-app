const express = require("express");
const router = express.Router();
const Screening = require("../models/Screening");
const verifyJWT = require("../utils/verify-jwt-middleware");

// movieId: String,
//   date: Date,
//   type: String,
//   sound: String,

router.get("/", verifyJWT, async (req, res, next) => {
  try {
    const threeHoursBefore = new Date();
    threeHoursBefore.setHours(threeHoursBefore.getHours() - 3); // -3hrs to show ongoing screenings as well

    const screenings = await Screening.find()
      .where("date")
      .gt(threeHoursBefore)
      .exec();

    return res.status(200).json(screenings);
  } catch (error) {
    next(error);
  }
});
