const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const executeQuery = require("../utils/executeQueries");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    try {
      //   Get token from hearer
      token = req.headers.authorization.split(" ")[1];

      //   Verify token
      const decoded = jwt.verify(token, "Yuva@123");

      //  Get user from token

      req.user = await executeQuery(
        "SELECT id, name, email FROM users WHERE id = ?",
        [decoded.id]
      );
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized no token");
  }
});
module.exports = { protect };
