import Listing from "../models/listing.model.js";

export const createListing = async(req,res,next)=>{
    try {
        const list = await Listing.create(req.body);
        res.status(200).json(list);
    } catch (error) {
        next(error);
    }
}