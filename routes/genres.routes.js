const express = require("express");

const { getGenres } = require("../controllers/genres.controller");

/* const {
	protectSession
} = require('../middlewares/auth.middlewares'); */

const genresRouter = express.Router();

/* genresRouter.use(protectSession); */

genresRouter.get("/", getGenres);

module.exports = { genresRouter };
