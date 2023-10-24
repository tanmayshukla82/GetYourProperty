import User from "../models/user.model.js";
import { errMessage } from "../utils/errorMessage.js";
import bcryptjs from 'bcryptjs';
export const update = async(req,res,next)=>{
    try{
        let updatedUser;
        if(req.user.id !== req.params.id)return next(errMessage(401,'forbidden'));
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10);
        }
        if(req.body.password===''){
             updatedUser = await User.findByIdAndUpdate(req.params.id, {
               $set: {
                 username:req.body.username,
                 email:req.body.email,
                 avatar : req.body.avatar
               },
             },{new:true});
        }else{
            updatedUser = await User.findByIdAndUpdate(req.params.id, {
              $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
              },
            },{new:true});
        }
        const {password:pass, ...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}
export const deleteUser = async(req,res,next)=>{
  if (req.user.id !== req.params.id)
    return next(errMessage(401, "forbidden"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({message:"User deleted successfully"});    
  } catch (error) {
    next(error);
  }
}