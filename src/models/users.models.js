import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Videos",
      },
    ],
  },
  { timestamps: true }
);
// Mongoose hook
userSchema.pre("save", function (next) {
  // Check if password has been modified if modified then use this logic
  if (!this.isModified("password")) return next();

  // Logic to hash password
  this.password = bcrypt.hash(this.password, 10);
  next();
});

// Now for checking passwords we will create a custom methods
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// Creating a JWT key
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_EXPIRY,
    }
  );
};
// JWT for refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
