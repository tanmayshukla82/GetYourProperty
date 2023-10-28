import express from 'express'
import {
  createListing,
  getListing,
  deleteUserList,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
router.post('/create',verifyToken,createListing);
router.get('/getListing/:id',verifyToken,getListing);
router.get("/deleteUserList/:id", verifyToken, deleteUserList);
export default router;