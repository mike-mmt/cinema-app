const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const Screening = require("../models/Screening");
const verifyJWT = require("../utils/verify-jwt-middleware");

const { validateMovieData } = require("../utils/form-validations");
const uploadFile = require("../utils/upload-to-cloudinary");

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
      if (!req.file || !validation) {
        return res.status(400).json({ error: "invalid form data" });
      }
      const fileUrl = await uploadFile(req.file);
      console.log(fileUrl);
      const newMovie = new Movie({
        ...req.body,
        mainPhotoUrl: fileUrl,
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

router.delete("/:movieId", verifyJWT, async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const deleteQuery = await Movie.findByIdAndDelete(movieId).exec();
    return res.status(200).json({ message: "success" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
