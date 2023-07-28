const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const executeQuery = require("../utils/executeQueries");

// @desc Register New User
// @route Post /api/user/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all field");
  }
  //check if user already exist
  const userData = await executeQuery("SELECT * FROM users WHERE email =?", [
    email,
  ]);

  if (userData.length !== 0) {
    res.status(400);
    throw new Error("User already exists");
  }

  // else register user
  // hash password before register
  const salt = await bcrypt.genSalt(10);
  const hashedPsw = await bcrypt.hash(password, salt);

  //insert to database
  const newUser = await executeQuery(
    "INSERT INTO  users (name,email,password) VALUES (?,?,?)",
    [name, email, hashedPsw]
  );

  //retreive saved data
  const user = await executeQuery("SELECT * FROM users WHERE email =?", [
    email,
  ]);
  res.status(201).json({
    data: {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      token: generateToken(user[0].id),
    },
  });
});

// @desc Login Old User
// @route Post /api/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await executeQuery("SELECT * FROM users WHERE email =?", [
    email,
  ]);
  if (user.length === 0) {
    res.status(400);
    throw new Error("User not found");
  } else if (await bcrypt.compare(password, user[0].password)) {
    res.status(200).json({
      data: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        token: generateToken(user[0].id),
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

// @desc GET user data
// @route Post /api/user
// @access Private
const getUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.length === 0) {
    res.status(400);
    throw new Error("User not found");
  }
  res.status(200).json({
    data: {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
    },
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, "Yuva@123", {
    expiresIn: "30d",
  });
};
module.exports = { registerUser, loginUser, getUser };
