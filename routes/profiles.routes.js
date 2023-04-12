const express = require('express');

// Controllers
const {
	createProfile,
	updateProfile,
	getProfile,
} = require('../controllers/profiles.controllers');
// Middlewares
const { profileExist } = require('../middlewares/profiles.middleware');
const {
	protectSession,
	protectProfileOwners,
} = require('../middlewares/auth.middlewares');

const profilesRouter = express.Router();
profilesRouter.use(protectSession);
profilesRouter.post('/', createProfile);
profilesRouter.patch('/:id', profileExist, protectProfileOwners, updateProfile);
profilesRouter.get('/:userId', getProfile);

module.exports = { profilesRouter };
