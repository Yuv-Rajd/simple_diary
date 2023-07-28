const express = require("express");
const router = express.Router();

// import controllers
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/userController");

// import private route middleware

const { protect } = require("../middleware/authMiddleware.js");

// define routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, getUser);

module.exports = router;
