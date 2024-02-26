import { response } from "express";
import { User } from "../models/users.models.js";
import { cloudinaryUpload } from "../utils/cloudinary.methods.js";
export const userRegister = async (req, res) => {
  try {
    const { username, email, fullname, password } = req.body;
    // console.log(username, email, fullname, password);
    // Step 1.Check If all required fields are getting
    if (
      [username, email, fullname, password].some((item) => item.trim() === "")
    ) {
      return res
        .status(200)
        .json({ success: false, message: "All fields are required" });
    }
    // Step 2. Check if username or email exists or not
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      return res.status(200).json({
        success: false,
        message: "User with username or email already exists",
      });
    }
    // Step 3. Handle files extract file path from req.files
    const avatarLocalPath = req.files?.avatar[0].path;
    let coverImageLocalPath;
    coverImageLocalPath = req.files?.coverImage[0].path || "";
    // Check if coverImage is present or not if not then we should move further as it optional

    // Step 4. Upload to cloudinary after calling utility function
    const avatar = await cloudinaryUpload(avatarLocalPath);
    const coverImage = await cloudinaryUpload(coverImageLocalPath);
    // save to database
    const user = await User.create({
      username,
      email,
      password,
      fullname,
      avatar: avatar?.url,
      coverImage: coverImage?.url,
    });
    // When getting response stop sensitive information from response
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res.status(200).json({
      success: true,
      message: "Details has been submitted",
      createdUser,
    });
  } catch (error) {
    console.log(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Step 1. check if username or email is there or not
    if (!(username || email)) {
      return res
        .status(400)
        .json({ success: false, message: "Username or Email is required" });
    }
    // Step 2. Find user with email or password and if empty then return error
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      return res
        .status(300)
        .json({ success: false, message: "User does not exist" });
    }
    // console.log(user)
    // Compare frontend and backend password
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res
        .status(300)
        .json({ success: false, message: "Password incorrect" });
    }
    // Generate cookies
    // 1. Generate access token
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    // Save in database
    // console.log(user.refreshToken)
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json({ success: true, message: "Login Successfull", loggedInUser });
  } catch (error) {
    console.log(error);
  }
};

export const userLogout = async (req, res) => {
  try {
    // This method is used to directly find and update
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 }, // this removes the field from document
      },
      { new: true } // If not done then it will give old response
    );

    return (
      res
        .status(200)
        // Clearing the cookies
        .clearCookie("accessToken", { httpOnly: true, secure: true })
        .clearCookie("refreshToken", { httpOnly: true, secure: true })
        .json({ success: true, message: "Logout Successfull" })
    );
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword && !newPassword) {
      return res
        .status(300)
        .json({ success: false, message: "please provide credentials" });
    }

    const user = await User.findById(req?.user?._id);

    // Compare new password with old Password
    const passwordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!passwordCorrect) {
      return res
        .status(300)
        .json({ success: false, message: "Invalid Password" });
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(300)
      .json({ success: true, message: "Password has been changed" });
  } catch (error) {
    console.log(error);
  }
};
