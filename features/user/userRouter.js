import express from "express";

import { registerUserCont, loginUserCont } from "./userController.js";

const userRoute = express.Router();

userRoute.post("/register", registerUserCont);
userRoute.post("/login", loginUserCont);
userRoute.post("/logout");

export default userRoute;
