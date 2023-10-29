import Listing from "../models/listing.model.js";
import { errMessage } from "../utils/errorMessage.js";

export const createListing = async(req,res,next)=>{
    try {
        const list = await Listing.create(req.body);
        res.status(200).json(list);
    } catch (error) {
        next(error);
    }
}
export const getListing = async(req,res,next)=>{
    if (req.user.id !== req.params.id)
      return next(errMessage(403, "Forbidden"));
    try {
        const listing = await Listing.find({userRef:req.params.id});
        if(!listing){
           return next(errMessage(402,"No listing found"));
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteUserList = async(req,res,next)=>{
    const userList = await Listing.findById(req.params.id);
    if(req.user.id!== userList.userRef)
        return next(errMessage(403,"Forbidden"));
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "List deleted" });
    } catch (error) {
        next(error)
    }
}
export const updateUserList = async(req,res,next)=>{
    const userList = await Listing.findById(req.params.id);
    if (req.user.id !== userList.userRef)
        return next(errMessage(403, "Forbidden"));
    try {
        const list = await Listing.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!list){
            return next(errMessage(402,"No listing found"))
        }
        res.status(200).json(list);
    } catch (error) {
        next(error)
    }
}   
 export const getUserListing = async(req,res,next)=>{
    try {
        const list = await Listing.findById(req.params.id);
        if(!list){
            return next(errMessage(402,"No listing found"));
        }
        res.status(200).json(list);
    } catch (error) {
        next(error)
    }
 }