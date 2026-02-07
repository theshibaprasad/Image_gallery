require("dotenv").config();

const app = require("../src/app");
const connectDB = require("../src/DB/db");

connectDB();

module.exports = app;
