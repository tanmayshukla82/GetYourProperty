import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errMessage } from "../utils/errorMessage.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const user = new User({ username, email, password: hashedPassword });
  try {
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errMessage(402, "User not found"));
    }
    const validPass = bcryptjs.compareSync(password, user.password);
    if (!validPass) {
      return next(errMessage(401, "Wrong credential"));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...restCredentials } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(restCredentials);
  } catch (error) {
    next(error);
  }
};
export const googleAuth = async (req, res) => {
  try {
    const { name, email, photo } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
      return;
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: generatedPassword,
        avatar: photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = newUser._doc;
       res
         .cookie("access_token", token, { httpOnly: true })
         .status(200)
         .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
export const signOut = (req,res,next)=>{
  try {
    res.clearCookie('access_token');
    res.status(200).json({message:"User logged out successfully"});
  } catch (error) {
    next(error);
  }
}
