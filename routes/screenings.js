const express = require("express");
const router = express.Router();
const Screening = require("../models/Screening");
const verifyJWT = require("../utils/verify-jwt-middleware");
const verifyAdmin = require("../utils/verify-admin");

// movieId: String,
//   date: Date,
//   type: String,
//   sound: String,

router.get("/", verifyJWT, async (req, res, next) => {
  try {
    let year, month, day;
    if (req.query.date) {
      [year, month, day] = req.query.date.split("-");
      month = month - 1;
      day = day - 1;
    }
    const threeHoursBefore = new Date();
    threeHoursBefore.setHours(threeHoursBefore.getHours() - 3); // -3hrs to show ongoing screenings as well

    let query = Screening.find();
    if (req.query.movieId) {
      query = query.where("movieId").equals(req.query.movieId);
    }
    if (req.query.date) {
      query = query
        .where("date")
        .gt(new Date(year, month, day))
        .lt(new Date(year, month, day + 1));
    } else {
      query = query
        .where("date")
        .gt(threeHoursBefore)
        .lt(new Date(new Date().setHours(23, 59, 59, 999)));
    }
    const screenings = await query.exec();

    return res.status(200).json(screenings);
  } catch (error) {
    next(error);
  }
});

router.post("/", [verifyJWT, verifyAdmin], async (req, res, next) => {
  try {
    const { movieId, type, sound } = req.body;
    console.log(req.body);
    const date = new Date(req.body.date);
    const rows = "ABCDEFGHIJKL";
    const seats_in_a_row = 16;
    let seats = Array.from(rows, (row) =>
      Array.from({ length: seats_in_a_row }, (_, number) => ({
        row,
        number: number + 1,
        class: "normal",
        taken: false,
      }))
    ).flat();
    seats = seats.map((seat) =>
      seat.row === "F" || seat.row === "G" ? { ...seat, class: "vip" } : seat
    );
    const screening = await Screening.create({
      movieId,
      date,
      type,
      sound,
      seats,
    });
    return res.status(201).json({ message: "success", screening });
  } catch (error) {
    next(error);
  }
});

router.post("/multiple", [verifyJWT, verifyAdmin], async (req, res, next) => {
  try {
    const screenings = req.body.map((data) => {
      const { movieId, type, sound } = data;
      const date = new Date(data.date);
      const rows = "ABCDEFGHIJKL";
      const seats_in_a_row = 16;

      let seats = Array.from(rows, (row) =>
        Array.from({ length: seats_in_a_row }, (_, number) => ({
          row,
          number: number + 1,
          class: "normal",
          taken: false,
        }))
      ).flat();
      seats = seats.map((seat) =>
        seat.row === "F" || seat.row === "G" ? { ...seat, class: "vip" } : seat
      );
      return {
        movieId,
        date,
        type,
        sound,
        seats,
      };
    });

    const screeningsQuery = await Screening.create(screenings);
    return res
      .status(201)
      .json({ message: "success", screenings: screeningsQuery });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
