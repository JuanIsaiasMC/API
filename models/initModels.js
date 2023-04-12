// Establish your models relations inside this function
// Models
const { User } = require("./user.model");
const { Profile } = require("./profile.model");
const { Track } = require("./track.model");
const { Genre } = require("./genre.model");
const initModels = async () => {
  User.hasOne(Profile);
  Profile.belongsTo(User);

  User.hasMany(Track, { foreignKey: "user_id" });
  Track.belongsTo(User, { foreignKey: "user_id" });

  Track.belongsToMany(Genre, {
    through: "track_genre",
    foreignKey: "track_id",
    otherKey: "genre_id",
    timestamps: false,
  });
  Genre.belongsToMany(Track, {
    through: "track_genre",
    foreignKey: "genre_id",
    otherKey: "track_id",
    timestamps: false,
  });

};

module.exports = { initModels, User, Track, Genre };
