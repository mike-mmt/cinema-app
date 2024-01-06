const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const Screening = require("../models/Screening");
const verifyJWT = require("../utils/verify-jwt-middleware");

router.get("/", verifyJWT, async (req, res, next) => {
  try {
    const allMovies = await Movie.aggregate()
      .match({ isCurrentlyScreening: true })
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
              date: { $gt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
            },
          },
          {
            $project: { _id: 0, movieId: 0 },
          },
        ],
        as: "screenings",
      })
      .project({
        // title: 1,
        // year: 1,
        // genres: 1,
        // director: 1,
        // actors: 1,
        photoUrl: { $arrayElemAt: ["$photoUrl.url", 0] },
        galleryPhotoUrls: {
          $map: {
            input: "galleryPhotoUrls",
            as: "photo",
            in: "$$photo.url",
          },
        },
      })
      .exec();

    return res.status(200).json(allMovies);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
