const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("MongoDB connected...");
    })
    .catch((err) => {
      console.log("connect.js error:", err);
    });
};

module.exports = connectDB;
