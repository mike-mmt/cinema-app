const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const Screening = require("../models/Screening");
const verifyJWT = require("../utils/verify-jwt-middleware");
const verifyAdmin = require("../utils/verify-admin");

router.get("/", verifyJWT, async (req, res, next) => {
  try {
    let year, month, day;
    if (req.query.date) {
      [year, month, day] = req.query.date.split("-");
      month = month - 1;
      day = day - 1;
    }
    const allMovies = await Movie.aggregate()
      .lookup({
        from: "photos",
        localField: "mainPhotoId",
        foreignField: "_id",
        as: "photoUrl",
      })
      .lookup({
        from: "photos",
        localField: "galleryPhotoIds",
        foreignField: "_id",
        as: "galleryPhotoUrls",
      })
      .lookup({
        from: "screenings",
        localField: "_id",
        foreignField: "movieId",
        pipeline: [
          {
            $match: {
              // if date is provided, match screenings on that date
              // else match screenings on from 3 hours before now to the end of this day
              date: req.query.date
                ? {
                    $gt: new Date(year, month, day),
                    $lt: new Date(year, month, day + 1),
                  }
                : {
                    $gt: new Date(Date.now() - 3 * 60 * 60 * 1000),
                    $lt: new Date(new Date().setHours(23, 59, 59, 999)),
                  },
            },
          },
          {
            $project: { movieId: 0 },
          },
        ],
        as: "screenings",
      })
      .sort({ _id: -1 })
      .project({
        title: 1,
        year: 1,
        genres: 1,
        director: 1,
        actors: 1,
        screenings: 1,
        photoUrl: { $arrayElemAt: ["$photoUrl.url", 0] },
        galleryPhotoUrls: {
          $map: {
            input: "$galleryPhotoUrls",
            as: "photo",
            in: "$$photo.url",
          },
        },
        isCurrentlyScreening: 1,
      })
      .exec();

    return res.status(200).json(allMovies);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/count", [verifyJWT, verifyAdmin], async (req, res, next) => {
  try {
    const count = await Movie.aggregate([
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          currentlyScreening: {
            $sum: {
              $cond: [{ $eq: ["$isCurrentlyScreening", true] }, 1, 0],
            },
          },
        },
      },
    ]).exec();
    return res.status(200).json({
      all: count[0].totalMovies,
      currentlyScreening: count[0].currentlyScreening,
      notCurrentlyScreening: count[0].totalMovies - count[0].currentlyScreening,
    });
  } catch (error) {}
});

module.exports = router;
