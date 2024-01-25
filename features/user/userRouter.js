import express from "express";

import {
  registerUserCont,
  loginUserCont,
  logoutUserCont,
} from "./userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRoute = express.Router();

userRoute.post("/register", registerUserCont);
userRoute.post("/login", loginUserCont);
userRoute.post("/logout", authMiddleware, logoutUserCont);

export default userRoute;
