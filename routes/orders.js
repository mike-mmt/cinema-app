const express = require("express");
const router = express.Router();
const verifyJWT = require("../utils/verify-jwt-middleware");
const Order = require("../models/Order");
const verifyAdmin = require("../utils/verify-admin");
const Screening = require("../models/Screening");
const retrievePrice = require("../utils/retrieve-price");

router.get("/stats", [verifyJWT, verifyAdmin], async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

router.post("/", verifyJWT, async (req, res, next) => {
  try {
    const screening = await Screening.findById(req.body.screeningId);
    const validSeats = req.body.seats.every((seat) => {
      const screeningSeat = screening.seats.find(
        (scrSeat) => scrSeat.row === seat.row && scrSeat.number === seat.number
      );
      return screeningSeat && !screeningSeat.taken;
    });
    if (!validSeats) {
      return res.status(400).json({ error: "seats occupied or invalid" });
    }
    const newOrder = await new Order({
      screeningId: req.body.screeningId,
      seats: req.body.seats.map((seat) => {
        return {
          row: seat.row,
          number: seat.number,
          class: seat.class,
        };
      }),
      price: retrievePrice(seat.class),
      paid: true, // payment api should set this
      date: req.body.date,
    }).save();
  } catch (error) {}
});
