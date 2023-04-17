// Establish your models relations inside this function
// Models
const { User } = require("./user.model");
const { Profile } = require("./profile.model");
const { Track } = require("./track.model");
const { Genre } = require("./genre.model");
const { Purchase } = require("./purchase.model");
const { FavoriteTrack } = require("./favoriteTrack.model");
const initModels = async () => {
  User.hasOne(Profile);
  Profile.belongsTo(User);

  User.hasMany(Track, { foreignKey: "user_id" });
  Track.belongsTo(User, { as: "artist", foreignKey: "user_id" });

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

  Track.belongsToMany(User, {
    through: Purchase,
    foreignKey: "trackId",
  });
  User.belongsToMany(Track, {
    through: Purchase,
    foreignKey: "userId",
  });

  Track.belongsToMany(User, {
    through: FavoriteTrack,
    foreignKey: "trackId",
  });
  User.belongsToMany(Track, {
    through: FavoriteTrack,
    foreignKey: "userId",
  });
};

module.exports = { initModels, User, Track, Genre, Purchase, FavoriteTrack };
