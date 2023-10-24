import jwt from 'jsonwebtoken';
import { errMessage } from './errorMessage.js';
export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token
    if(!token){
        return next(errMessage(401, 'Unauthorized'));
    }  
    jwt.verify(token, process.env.JWT_SECRET_KEY,(error,user)=>{
        if(error) return next(errMessage(403,'forbidden'));
        req.user = user;
        return next();
    });
}