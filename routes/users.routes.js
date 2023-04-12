const express = require("express");

// Controllers
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
  forgotPassword,
  resetPassword,
  bulkCreateUsers
} = require("../controllers/users.controller");

// Middlewares
const { userExists } = require("../middlewares/users.middlewares");
const {
  protectSession,
  protectUsersAccount,
  protectAdmin,
} = require("../middlewares/auth.middlewares");
const {
  createUserValidators,
} = require("../middlewares/validators.middlewares");

const usersRouter = express.Router();

// register
usersRouter.post("/", createUserValidators, createUser);

usersRouter.post("/createUsers", bulkCreateUsers);

usersRouter.post("/login", login);

usersRouter.post("/forgot-password", forgotPassword);

// usersRouter.post('/reset-password', resetPassword);
usersRouter.post("/reset-password", resetPassword);
// probar con dos puntos como si fuera params

// Protecting below endpoints
// usersRouter.use(protectSession);

usersRouter.get("/", getAllUsers); //protectAdmin

usersRouter.patch("/:id", userExists, protectUsersAccount, updateUser);

usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

module.exports = { usersRouter };
