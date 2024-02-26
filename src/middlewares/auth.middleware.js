import jwt from "jsonwebtoken";
import { User } from "../models/users.models.js";
export const verifyUser = async (req, res, next) => {
  try {
    // get access token from req.cookies
    const { accessToken } = req.cookies;
    //
    if (!accessToken) {
      return res
        .status(200)
        .json({ status: false, message: "Unauthorized user" });
    }
    // Verify will decode the payload from string
    // First parameter is our payload or accessToken coming from frontend
    // Second parameter is our secret key
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);
    // console.log(decodedToken)
    // Find user with decoded Token's Id

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken -createdAt -updatedAt"
    );
    // console.log(user)
    if (!user) {
      return res.status(300).json({ success: false, message: "Unauthorized" });
    }
    // set a req.user as user to use in next controller
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
  }
};
