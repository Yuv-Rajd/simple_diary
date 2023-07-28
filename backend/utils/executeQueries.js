const mysql = require("mysql");
const connectDB = require("../config/db");

const executeQuery = (sql, param) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = mysql.format(sql, param);
    connectDB.query(sqlQuery, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
};

module.exports = executeQuery;
