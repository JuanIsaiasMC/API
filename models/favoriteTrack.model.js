const { db, DataTypes } = require("../utils/database.util");

const FavoriteTrack = db.define("favoriteTrack", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: "users",
      key: "id",
    },
  },
  trackId: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    references: {
      model: "tracks",
      key: "id",
    },
  }
});

module.exports = { FavoriteTrack };
