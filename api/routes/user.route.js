import express from "express";
import { deleteUser, update } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import cookieParser from "cookie-parser";
const userRouter = express.Router();
userRouter.use(cookieParser());
userRouter.post("/update/:id",verifyToken, update);
userRouter.delete("/delete/:id",verifyToken,deleteUser);
export default userRouter;
