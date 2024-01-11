import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./connectDB.js";
import userRoute from "./features/user/userRouter.js";
import { errorMiddlware } from "./features/middleware/errorHandlerMiddleware.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./features/middleware/authMiddleware.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

// user route
app.use("/api/user", userRoute);

// authorization testing route
app.get("/", authMiddleware, (req, res) => {
  res.json({ hello: "authorized" });
});

// error handler middleware
app.use(errorMiddlware);

app.listen(3000, () => {
  connectDB();
  console.log("server is listening at port 3000");
});
