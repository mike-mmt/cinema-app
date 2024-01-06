const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const Screening = require("../models/Screening");
const verifyJWT = require("../utils/verify-jwt-middleware");
const Photo = require("../models/Photo");

const { validateMovieData } = require("../utils/form-validations");
const uploadFile = require("../utils/upload-to-cloudinary");
const deletePhoto = require("../utils/delete-photo");
const {
  newPhotoFromFile,
  newPhotoFromUrl,
  newPhotosFromFileArray,
  newPhotosFromUrlArray,
} = require("../utils/new-photo");

const uploadMiddleware = require("../utils/multer-middleware");

router.get("/:movieId", verifyJWT, async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const movie = await Movie.findById(movieId).select(
      "title year genre director actors mainPhotoId galleryPhotoIds"
    );

    const threeHoursBefore = new Date();
    threeHoursBefore.setHours(threeHoursBefore.getHours() - 3); // -3hrs to show ongoing screenings as well

    const screenings = await Screening.find()
      .where("movieId")
      .equals(movieId)
      .where("date")
      .gt(threeHoursBefore)
      .exec();

    res.status(200).json({
      movieData: movie,
      screenings: screenings,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/add",
  [
    verifyJWT,
    uploadMiddleware.single("image"),
    uploadMiddleware.array("galleryImages"),
  ], // middleware
  async (req, res, next) => {
    try {
      req.body.genres = JSON.parse(req.body.genres);
      req.body.actors = JSON.parse(req.body.actors);
      req.body.year = parseInt(req.body.year);
      const validation = validateMovieData(req.body);
      if ((!req.file && !req.body.photoUrl) || !validation) {
        return res.status(400).json({ error: "invalid form data" });
      }

      const photo = await handleReqPhoto(req);

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

router.delete("/:movieId", verifyJWT, async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const deleteQuery = await Movie.findByIdAndDelete(movieId).exec();
    const deletePhotoQuery = await deletePhoto(deleteQuery._doc.mainPhotoId);
    return res.status(200).json({ message: "success", ...deleteQuery });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:movieId",
  [
    verifyJWT,
    uploadMiddleware.fields([
      { name: "image", maxCount: 1 },
      { name: "galleryImages", maxCount: 12 },
    ]),
  ], // middleware
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

module.exports = router;
