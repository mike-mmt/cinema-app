const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { NONAME } = require("dns");
const setAdminAccount = require("./utils/set-admin-account");
// const mqttClient = require("./mqtt-client");
// const mqtt = require("mqtt");
// const resolveMqttMessage = require("./mqttOperations");
// const Screening = require("./models/Screening");
// const Order = require("./models/Order");
// const retrievePrice = require("./utils/retrieve-price");
// const Account = require("./models/Account");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
// app.use("/upload", require("./routes/upload"));
app.use("/movie", require("./routes/movie"));
app.use("/movies", require("./routes/movies"));
app.use("/screenings", require("./routes/screenings"));
app.use("/account", require("./routes/account"));
app.use("/orders", require("./routes/orders"));
app.use("/prices", require("./routes/prices"));
app.use("/comments", require("./routes/comments"));

app.listen(port, () => {
  // perform a database connection when server starts
  mainDatabaseConnection().catch((err) => console.log(err));
  console.log(`Backend server is running on port: ${port}`);

  // const mqttClient = mqtt.connect("ws://localhost:8000/mqtt");
  // // module.exports = { mqttClient };

  // mqttClient.on("connect", () => {
  //   console.log("connected to mqtt broker");

  //   mqttClient.subscribe(["omnicinema/chat", "omnicinema/comments"], (err) => {
  //     if (!err) {
  //       mqttClient.publish("presence", "Hello mqtt");
  //     }
  //   });
  //   mqttClient.on("message", resolveMqttMessage);
  // });

  // module.exports = mqttClient;
});

async function mainDatabaseConnection() {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "cinema" }); // "mongodb://127.0.0.1:27017/cinema"
  await setAdminAccount();
  console.log("Database connected!");
}

// async function resolveMqttMessage(topic, message) {
//   console.log(`Received message: ${message.toString()} on topic: ${topic}`);
//   switch (topic) {
//     case "omnicinema/getScreening":
//       const screeningId = message.toString();
//       //   topic.match(
//       //     /^omnicinema\/requestScreening\/(.+)$/
//       //   )[1];
//       const screening = await Screening.findById(screeningId)
//         .populate("movieId")
//         .exec();
//       screening &&
//         client.publish(
//           `omnicinema/screening/${screeningId}`,
//           JSON.stringify(screening)
//         );
//       break;
//     case "omnicinema/comments":
//       const comment = JSON.parse(message.toString());
//       const newComment = await new Comment(comment).save();
//       client.publish(`omnicinema/comments/out`, JSON.stringify(newComment));
//     default:
//       console.log("default case");
//       break;
//   }
// }
