import express from 'express'
import {
  createListing,
  getListing,
  deleteUserList,
  updateUserList,
  getUserListing,
  listings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
router.post('/create',verifyToken,createListing);
router.get('/getListing/:id',verifyToken,getListing);
router.get('/deleteUserList/:id', verifyToken, deleteUserList);
router.post('/updateUserList/:id', verifyToken, updateUserList);
router.get("/getUserListing/:id", getUserListing);
router.get("/listings",listings);
export default router;