const encBase64 = require("crypto-js/enc-base64");
const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());
mongoose.connect("mongodb://localhost:27017/vinted");

cloudinary.config({
  cloud_name: "dhqkepftc",
  api_key: "967224724169716",
  api_secret: "ya4UtF9pRyvtCalAJ97VOBKgaSM",
});

const userRoutes = require("./routes/sign_up");
// const userTest = require("./routes/test");
const offerRoutes = require("./routes/offer");

app.use(userRoutes);
app.use(offerRoutes);
// app.use(userTest);

app.all("*", (req, res) => {
  res.status(404).json("this route is not exsist");
});

app.listen(3000, () => {
  console.log("Server started");
});
