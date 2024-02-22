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
