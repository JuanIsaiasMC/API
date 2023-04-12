require("dotenv").config();
const { app } = require("./app");

// Utils
const { initModels } = require("./models/initModels");
const { db } = require("./utils/database.util");
const { Genre } = require("./models/genre.model");

//dotenv.config({ path: './config.env' });

const musicGenres = [
  "rock",
  "pop",
  "jazz",
  "hip hop",
  "reggaeton",
  "blues",
  "country",
  "folk",
  "electronic",
  "classical",
  "rap",
  "r&b",
  "metal",
  "salsa",
  "merengue",
  "bachata",
  "cumbia",
  "funk",
  "soul",
  "disco"
];

const startServer = async () => {
  try {
    await db.authenticate();
    // Establish the relations between models
    await initModels();
    await db.sync({ force: false });
    // Set server to listen
    const PORT = 4000;
    app.listen(PORT, async () => {
      console.log(`Express app running on port ${PORT}!`);
    
      const promises = musicGenres.map((genreName) => Genre.findOrCreate({where: {name: genreName}}))
      await Promise.all(promises);

    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
