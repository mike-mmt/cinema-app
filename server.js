const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Account = require("./models/Account");
const Order = require("./models/Order");
const Photo = require("./models/Photo");
const Screening = require("./models/Screening");
const Movie = require("./models/Movie");
const { NONAME } = require("dns");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));

app.listen(port, () => {
  // perform a database connection when server starts
  mainDatabaseConnection().catch((err) => console.log(err));
  console.log(`Backend server is running on port: ${port}`);
});

async function mainDatabaseConnection() {
  await mongoose.connect("mongodb://127.0.0.1:27017/cinema");
  console.log("Database connected!");
}
