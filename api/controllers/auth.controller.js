import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errMessage } from "../utils/errorMessage.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password,10);
  const user = new User({ username, email, password:hashedPassword });
  try {
      await user.save();
      res.status(201).json({ message: "User created successfully" });
  } catch (error) {
      next(error);
  }
};
export const signin = async(req, res, next)=>{
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email});
    if(!user){
      return next(errMessage(402,'User not found'));
    }
    const validPass = bcryptjs.compareSync(password, user.password);
    if (!validPass) {
      return next(errMessage(401,'Wrong credential'));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    const {password:pass, ...restCredentials} = user._doc;
    res.cookie('access_tokwn',token,{httpOnly:true}).status(200).json(restCredentials);
  } catch (error) {
    next(error);
  }
}
