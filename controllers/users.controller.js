const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

// Models
const { User } = require("../models/user.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

// Gen random jwt signs
// require('crypto').randomBytes(64).toString('hex') -> Enter into the node console and paste the command

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    where: { status: "active" },
  });

  res.status(200).json({
    status: "success",
    data: { users },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { userName, email, password } = req.body;

  // if (role !== 'admin' && role !== 'normal') {
  // 	return next(new AppError('Invalid role', 400));
  // }

  // Encrypt the password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    userName,
    email,
    password: hashedPassword,
  });

  // Remove password from response
  newUser.password = undefined;

  // 201 -> Success and a resource has been created
  return res.status(201).json({
    status: "success",
    data: { newUser },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { user } = req;

  await user.update({ name });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: "deleted" });

  res.status(204).json({ status: "success" });
});

const login = catchAsync(async (req, res, next) => {
  // Get email and password from req.body
  const { email, password } = req.body;

  // Validate if the user exist with given email
  const user = await User.findOne({
    where: { email, status: "active" },
  });

  // Compare passwords (entered password vs db password)
  // If user doesn't exists or passwords doesn't match, send error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Wrong credentials", 400));
  }

  // Remove password from response
  user.password = undefined;

  // Generate JWT (payload, secretOrPrivateKey, options)
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    status: "success",
    data: { user, token },
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  // we need the user's email from the request body
  const { email } = req.body;

  // we need to search the email in the database
  const user = await User.findOne({ where: { email } });

  // if the email doesn't exist, send error
  if (!user) {
    return next(new AppError("Email does not exist", 400));
  }

  // generate a token that expires in 1 hour
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // send email with token
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // configure the email content
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: user.email,
    subject: "restableciendo contraseña",
    html: `<a href='${process.env.BASE_URL}/#/reset-password/${token}'>click aqui para restablecer tu contraseña</a>`,
  };

  // 	send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return next(new AppError("no se pudo enviar el mensaje", 400));
    }
  });
  return res.status(200).json({
    status: "success",
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;

  // check if the token is valid
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // search for the user that corresponse to the token id and update the password

  const user = await User.update(
    { password: hashedPassword },
    { where: { id: decodedToken.userId } }
  );

  // reset the password of the user
  // user.password = password;

  // await user.save();

  // show succes message

  return res.status(200).json({
    status: "Contraseña cambiada exitosamente",
    data: { user },
  });
});

const bulkCreateUsers = catchAsync(async (req, res, next) => {
  try {
    const usersData = req.body;

    // Hash the passwords for all the users
    const users = await Promise.all(
      usersData.map(async (userData) => {
        const { password, ...rest } = userData;
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        return { ...rest, password: hashedPassword };
      })
    );

    // Create the users in the database
    const createdUsers = await User.bulkCreate(users);

    // Remove password from response
    const sanitizedUsers = createdUsers.map((user) => {
      const { password, ...rest } = user.toJSON();
      return rest;
    });

    // 201 -> Success and a resource has been created
    return res.status(201).json({
      status: "success",
      data: { users: sanitizedUsers },
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  forgotPassword,
  resetPassword,
  bulkCreateUsers
};
