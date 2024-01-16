import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import connectDB from "./connectDB.js";
import userRoute from "./features/user/userRouter.js";
import { errorMiddlware } from "./features/middleware/errorHandlerMiddleware.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./features/middleware/authMiddleware.js";
import pollRoute from "./features/poll/pollRouter.js";

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// user route
app.use("/api/user", userRoute);

// poll route
app.use("/api/poll", authMiddleware, pollRoute);

// error handler middleware
app.use(errorMiddlware);

app.listen(3000, () => {
  connectDB();
  console.log("server is listening at port 3000");
});
