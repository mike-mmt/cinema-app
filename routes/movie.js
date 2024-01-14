const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const Screening = require("../models/Screening");
const verifyJWT = require("../utils/verify-jwt-middleware");
const Photo = require("../models/Photo");

const { validateMovieData } = require("../utils/form-validations");
const deletePhoto = require("../utils/delete-photo");
const {
  newPhotoFromFile,
  newPhotoFromUrl,
  newPhotosFromFileArray,
  newPhotosFromUrlArray,
} = require("../utils/new-photo");

const {
  uploadSingle,
  uploadMultiple,
  uploadFields,
} = require("../utils/multer-middleware");
const verifyAdmin = require("../utils/verify-admin");
const { default: mongoose } = require("mongoose");

router.get("/:movieId", verifyJWT, async (req, res, next) => {
  try {
    let year, month, day;
    if (req.query.date) {
      [year, month, day] = req.query.date.split("-");
      month = month - 1;
      day = day - 1;
    }
    const movieId = req.params.movieId;
    const movie = await Movie.aggregate()
      .match({ _id: new mongoose.Types.ObjectId(movieId) })
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
            $project: { _id: 0, movieId: 0 },
          },
        ],
        as: "screenings",
      })
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
      })
      .exec();
    res.status(200).json(movie[0]);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  [verifyJWT, verifyAdmin, uploadSingle], // middleware
  async (req, res, next) => {
    try {
      console.log(req.body);
      req.body.genres = JSON.parse(req.body.genres);
      req.body.actors = JSON.parse(req.body.actors);
      req.body.year = parseInt(req.body.year);
      const validation = validateMovieData(req.body);
      if ((!req.file && !req.body.photoUrl) || !validation) {
        return res.status(400).json({ error: "invalid form data" });
      }

      let photo;
      if (req.body.photoUrl) {
        photo = await newPhotoFromUrl(req.body.photoUrl);
      } else if (req.file) {
        photo = await newPhotoFromFile(req.file);
      }

      const newMovie = new Movie({
        ...req.body,
        mainPhotoId: photo,
        galleryPhotoUrls: [],
        isCurrentlyScreening: true,
      });
      await newMovie.save();
      return res
        .status(201)
        .json({ message: "success", createdMovie: newMovie });
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/:movieId", [verifyJWT, verifyAdmin], async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const deleteQuery = await Movie.findByIdAndDelete(movieId).exec();
    console.log(deleteQuery._doc);
    const deletePhotoQuery = await deletePhoto(deleteQuery._doc.mainPhotoId);
    return res.status(200).json({ message: "success", deleteQuery });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:movieId",
  [verifyJWT, verifyAdmin, uploadFields], // middleware
  async (req, res, next) => {
    try {
      // conditionally add fields
      const newMovie = {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.director && { director: req.body.director }),
        ...(req.body.year && { year: parseInt(req.body.year) }),
        ...(req.body.isCurrentlyScreening && {
          isCurrentlyScreening: req.body.isCurrentlyScreening === "true",
        }),
      };
      const genres = req.body.genres ? JSON.parse(req.body.genres) : [];
      const actors = req.body.actors ? JSON.parse(req.body.actors) : [];
      const galleryPhotoIds = [];
      // photo handling
      if (req.files.image || req.body.photoUrl) {
        newMovie.mainPhotoId = req.body.photoUrl
          ? await newPhotoFromUrl(req.body.photoUrl)
          : await newPhotoFromFile(req.file.image[0]);
      }
      if (req.files.galleryImages) {
        const ids = await newPhotosFromFileArray(req.files.galleryImages);
        galleryPhotoIds.push(...ids);
      }
      if (req.body.galleryPhotoUrls) {
        const ids = await newPhotosFromUrlArray(req.galleryPhotoUrls);
        galleryPhotoIds.push(...ids);
      }
      // update the movie
      const update = await Movie.findByIdAndUpdate(
        req.params.movieId,
        {
          ...newMovie,
          $addToSet: {
            genres: { $each: genres || [] },
            actors: { $each: actors || [] },
            galleryPhotoIds: { $each: galleryPhotoIds || [] },
          },
        },
        { new: true }
      );
      return res.status(200).json({ message: "success", update });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:movieId/genre",
  [verifyJWT, verifyAdmin],
  async (req, res, next) => {
    try {
      if (req.query.genreName) {
        const update = await Movie.findByIdAndUpdate(req.params.movieId, {
          $pull: { genres: req.query.genreName },
        });
        return res.status(200).json({ message: "success", update });
      }
    } catch (error) {}
  }
);
router.delete(
  "/:movieId/actor",
  [verifyJWT, verifyAdmin],
  async (req, res, next) => {
    try {
      if (req.query.actorName) {
        const update = await Movie.findByIdAndUpdate(req.params.movieId, {
          $pull: { actors: req.query.actorName },
        });
        return res.status(200).json({ message: "success", update });
      }
    } catch (error) {}
  }
);
router.delete(
  "/:movieId/galleryPhotoId",
  [verifyJWT, verifyAdmin],
  async (req, res, next) => {
    try {
      if (req.query.galleryPhotoId) {
        const update = await Movie.findByIdAndUpdate(req.params.movieId, {
          $pull: { galleryPhotoIds: req.query.galleryPhotoId },
        });
        await deletePhoto(galleryPhotoId);
        return res.status(200).json({ message: "success", update });
      }
    } catch (error) {}
  }
);

module.exports = router;
