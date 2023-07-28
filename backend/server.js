// imports
const path = require("path");
const express = require("express");
const dotenv = require("dotenv").config;
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

// setup port
const PORT = process.env.PORT || 5500;

// connect database
connectDB.connect();

// create express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// config cross origins
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Headers", "Authorization,Content-Type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

//routers || req res ||
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/notes", require("./routes/notesRoutes"));

app.use(errorHandler);

if (process.env.NODE_ENV === "development") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"))
  );
  console.log(path.join(__dirname, "..", "client", "build", "index.html"));
}

// responsing posrt listening
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
