export const userRegister = async (req, res) => {
  try {
    const { username, email, fullname, password } = req.body;
    console.log(req)
    return res
      .status(200)
      .json(req.body);
  } catch (error) {
    console.log(error);
  }
};
export const user = async (req, res) => {
  try {
    const { username, email, fullname, password } = req.body;
    console.log(req.body)
    return res
      .status(200)
      .json(req.body);
  } catch (error) {
    console.log(error);
  }
};
