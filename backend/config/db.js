const mysql = require("mysql");
const connectDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "simple_diary",
});

module.exports = connectDB;
