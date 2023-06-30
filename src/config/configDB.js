const mysql2 = require("mysql2/promise");

// set up dotenv
require("dotenv").config();

const pool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER_DB,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});


module.exports = pool;
