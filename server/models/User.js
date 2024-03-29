const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Duplicate username"],
      minlength: [1, "Username must be at least 1 character long"],
      maxlength: [20, "Username must be at most 10 characters"],
      match: [
        /^[a-zA-Z0-9_.-]+$/,
        "Username can only contain letters, numbers, dash, underscore and dot",
      ],
      // lowercase all usernames
      set: function (val) {
        return val.toLowerCase();
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Duplicate email"],
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Invalid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [32, "Password must be at most 32 characters"],
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
    profilePhoto: {
      type: String,
    },
  },
  {
    collection: "users",
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", UserSchema);
