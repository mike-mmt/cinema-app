const express = require("express");
const router = express.Router();
const verifyJWT = require("../utils/verify-jwt-middleware");
const Order = require("../models/Order");
const verifyAdmin = require("../utils/verify-admin");
const Screening = require("../models/Screening");
const retrievePrice = require("../utils/retrieve-price");
const Account = require("../models/Account");

router.get("/stats", [verifyJWT, verifyAdmin], async (req, res, next) => {
  try {
    const { dateFrom, dateTo, month, year } = req.query;

    const timeSelectPipeline = [
      {
        $match: {
          date: {
            ...(dateFrom && { $gte: new Date(dateFrom) }),
            ...(dateTo && { $lte: new Date(dateTo) }),
          },
        },
      },
    ];

    const orders = await Order.aggregate([
      { $match: { paid: true } },
      {
        $lookup: {
          from: "screenings",
          localField: "screeningId",
          foreignField: "_id",
          as: "screening",
          ...((dateFrom || dateTo) && { pipeline: timeSelectPipeline }),
        },
      },
      { $unwind: "$screening" },
      {
        $group: {
          _id: "$screening._id",
          movieId: { $first: "$screening.movieId" },
          totalPerScreening: { $sum: "$price" },
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movie",
          pipeline: [{ $project: { title: 1, _id: 1 } }],
        },
      },
      {
        $group: {
          _id: "$movieId",
          totalPerMovie: { $sum: "$totalPerScreening" },
          movie: { $first: "$movie" },
          screenings: {
            $push: {
              screeningId: "$_id",
              total: "$totalPerScreening",
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPerMovie" },
          movies: {
            $push: {
              movie: { $first: "$movie" },
              totalPerMovie: "$totalPerMovie",
              screenings: "$screenings",
            },
          },
        },
      },
      // {
      //   $group: {
      //     _id: "$movieId",
      //     totalPerMovie: { $sum: "$totalPerScreening" },
      //     screenings: {
      //       $push: {
      //         screeningId: "$_id",
      //         total: "$totalPerScreening",
      //       },
      //     },
      //   },
      // },
      // {
      //   $group: {
      //     _id: null,
      //     total: { $sum: "$totalPerMovie" },
      //     movies: {
      //       $push: {
      //         movieId: "$_id",
      //         total: "$totalPerMovie",
      //         screenings: "$screenings",
      //       },
      //     },
      //   },
      // },
      {
        $project: {
          _id: 0,
          total: 1,
          movies: 1,
          // {
          //   movie: { $first: "$movies.movie" },
          //   totalPerMovie: 1,
          //   screenings: 1,
          // },
        },
      },
    ]).exec();
    return res.status(200).json(orders[0]);
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
      return res.status(400).json({ message: "seats occupied or invalid" });
    }
    const finalPrice = req.body.seats.reduce((acc, seat) => {
      return acc + retrievePrice(seat.class);
    }, 0);
    const newOrder = await new Order({
      screeningId: req.body.screeningId,
      seats: req.body.seats.map((seat) => {
        return {
          row: seat.row,
          number: seat.number,
          class: seat.class,
        };
      }),
      price: finalPrice,
      paid: true, // payment api should set this
      date: req.body.date,
    }).save();

    const newSeats = screening.seats.map((seat) => {
      if (
        req.body.seats.some(
          (s) => s.row === seat.row && s.number === seat.number
        )
      ) {
        return {
          row: seat.row,
          number: seat.number,
          class: seat.class,
          taken: true,
        };
      } else {
        return {
          row: seat.row,
          number: seat.number,
          class: seat.class,
          taken: seat.taken,
        };
      }
    });

    const updatedScreening = await Screening.findByIdAndUpdate(
      req.body.screeningId,
      {
        $set: {
          seats: newSeats,
        },
      }
    ).exec();
    const updatedAccount = await Account.findByIdAndUpdate(req.body.userId, {
      $push: {
        orders: newOrder._id,
      },
    }).exec();
    return res.status(200).json(newOrder);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
