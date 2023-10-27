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