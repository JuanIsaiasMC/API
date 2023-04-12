const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Establish db connection
const db = new Sequelize(
	process.env.DB,
	process.env.DB_USERNAME,
	process.env.DB_PASSWORD,
	{
		dialect: 'postgres',
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,

		logging: false,
	}
);

module.exports = { db, DataTypes };
