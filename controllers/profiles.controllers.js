// Models
const { Profile } = require('../models/profile.model');
const { User } = require('../models/user.model');

// Utils

const { catchAsync } = require('../utils/catchAsync.util');

const createProfile = catchAsync(async (req, res, next) => {
	const { sessionUser } = req;
	const { name, surname, age, genre } = req.body;

	const newProfile = await Profile.create({
		name,
		surname,
		age,
		genre,
		userId: sessionUser.id,
	});

	res.status(201).json({
		status: 'succes',
		data: {
			newProfile,
			email: sessionUser.email,
			userName: sessionUser.userName,
		},
	});
});

const updateProfile = catchAsync(async (req, res, next) => {
	const { name, surname, age, genre } = req.body;
	const { profile } = req;

	await profile.update({ name, surname, age, genre });

	res.status(200).json({
		status: 'success',
		data: { profile },
	});
});

const getProfile = catchAsync(async (req, res, next) => {
	const { userId } = req.params;
	const profile = await Profile.findOne({
		where: { userId },
		include: { model: User, attributes: { exclude: ['password'] } },
	});

	res.status(200).json({
		status: 'succes',
		data: { profile },
	});
});

module.exports = { createProfile, updateProfile, getProfile };
