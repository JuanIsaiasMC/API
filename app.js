const express = require("express");

// Routers

const { usersRouter } = require("./routes/users.routes");
const { tracksRouter } = require("./routes/tracks.routes");
const { profilesRouter } = require('./routes/profiles.routes');
const { genresRouter } = require('./routes/genres.routes');

// Controllers
const { globalErrorHandler } = require("./controllers/error.controller");
const cors = require("cors");
// Init our Express app
const app = express();

// Enable Express app to receive JSON data
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// Define endpoints
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/profiles', profilesRouter);
app.use("/api/v1/tracks", tracksRouter);
app.use("/api/v1/genres", genresRouter);

// Global error handler
app.use(globalErrorHandler);

// Catch non-existing endpoints
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `${req.method} ${req.url} does not exists in our server`,
  });
});

module.exports = { app };
