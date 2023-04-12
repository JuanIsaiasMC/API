// Models
const { Profile } = require('../models/profile.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const profileExist = catchAsync(async (req, res, next) => {
	const { id } = req.params;

	const profile = await Profile.findOne({ where: { id } });

	if (!Profile) {
		return next(new AppError('Profile does not exists', 404));
	}

	req.profile = profile;
	next();
});

module.exports = { profileExist };
