export const userRegister = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "User has been created" });
  } catch (error) {
    console.log(error);
  }
};
