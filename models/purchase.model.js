const { db, DataTypes } = require("../utils/database.util");

const Purchase = db.define("purchase", {
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
  },
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
});

module.exports = { Purchase };
