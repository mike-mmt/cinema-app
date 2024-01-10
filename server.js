const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { NONAME } = require("dns");
const setAdminAccount = require("./utils/set-admin-account");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
// app.use("/upload", require("./routes/upload"));
app.use("/movie", require("./routes/movie"));
app.use("/movies", require("./routes/movies"));

app.listen(port, () => {
  // perform a database connection when server starts
  mainDatabaseConnection().catch((err) => console.log(err));
  console.log(`Backend server is running on port: ${port}`);
});

async function mainDatabaseConnection() {
  await mongoose.connect("mongodb://127.0.0.1:27017/cinema");
  await setAdminAccount();
  console.log("Database connected!");
}
