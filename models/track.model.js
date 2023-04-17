const { db, DataTypes } = require("../utils/database.util");

const Track = db.define("track", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false /* 
    unique: true, */,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: 0,
      max: 1000,
    },
  },
  duration: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false /* ,
    unique: true, */,
  },
  artwork: {
    type: DataTypes.TEXT,
    defaultValue:
      "https://cdns.iconmonstr.com/wp-content/releases/preview/2012/240/iconmonstr-sound-wave-4.png",
  },
  sales_accountant: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  on_sale: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  favorites_counter : {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = { Track };
