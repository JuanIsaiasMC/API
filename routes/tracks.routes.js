const express = require("express");
const multer = require("multer");

const {
  uploadTrack,
  getTracks,
  uploadTracksTest,
  makePayment,
  completePurchase,
  addToFavorite,
  removeFavorite
} = require("../controllers/tracks.controller");

const { protectSession } = require("../middlewares/auth.middlewares");

const tracksRouter = express.Router();

tracksRouter.post("/uploadForTests", uploadTracksTest);

tracksRouter.use(protectSession);

tracksRouter.get("/", getTracks);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

tracksRouter.post(
  "/upload",
  upload.fields([{ name: "audio" }, { name: "image" }]),
  uploadTrack
);

tracksRouter.post("/makePayment", makePayment);
tracksRouter.post("/completePurchase", completePurchase);

tracksRouter.post("/addToFavorite", addToFavorite);
tracksRouter.delete("/removeFavorite", removeFavorite);

module.exports = { tracksRouter };
