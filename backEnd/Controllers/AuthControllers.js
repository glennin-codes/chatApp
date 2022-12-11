import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../Errors/createError.js";

//Register user;
export const registerUser = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashpwd = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashpwd;
  const newUser = UserModel(req.body);
  const { username } = req.body;

  try {
    //comparing added user with users signed up
    const oldUser = await UserModel.findOne({ username });
    if (oldUser) return next(createError(400, 'user already exists'));
    //if not save user
    const user = await newUser.save();
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT,
      { expiresIn: "1h" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

//login user
export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        return next(createError(400, "wrong password"));
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWT,
          { expiresIn: "1h" }
        );
        res.status(200).json(user, token);
      }
    } else {
      next(createError(404, "user not found"));
    }
  } catch (error) {
    next(error);
  }
};


export default {loginUser,registerUser}