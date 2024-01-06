const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const Screening = require("../models/Screening");
const verifyJWT = require("../utils/verify-jwt-middleware");
const Photo = require("../models/Photo");

const { validateMovieData } = require("../utils/form-validations");
const uploadFile = require("../utils/upload-to-cloudinary");
const deletePhoto = require("../utils/delete-photo");

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
  [verifyJWT, uploadMiddleware.single("image")], // middleware
  async (req, res, next) => {
    try {
      req.body.genres = JSON.parse(req.body.genres);
      req.body.actors = JSON.parse(req.body.actors);
      req.body.year = parseInt(req.body.year);
      const validation = validateMovieData(req.body);
      if ((!req.file && !req.body.photoUrl) || !validation) {
        return res.status(400).json({ error: "invalid form data" });
      }

      const photo = await handlePhoto(req);

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

router.patch("/:movieId", verifyJWT, async (req, res, next) => {});

async function handlePhoto(req) {
  const cloudPhoto = req.body.photoUrl ? null : await uploadFile(req.file);
  const databasePhotoData = req.body.photoUrl
    ? { type: "external", url: req.body.photoUrl }
    : {
        type: "cloudinary",
        cloudinaryPublicId: cloudPhoto.public_id,
        url: cloudPhoto.secure_url,
      };
  const databasePhoto = await new Photo(databasePhotoData).save();
  return databasePhoto._id;
}

module.exports = router;
