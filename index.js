import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

import connectDB from "./connectDB.js";
import userRoute from "./features/user/userRouter.js";
import pollRoute from "./features/poll/pollRouter.js";
import { errorMiddlware } from "./features/middleware/errorHandlerMiddleware.js";
import { authMiddleware } from "./features/middleware/authMiddleware.js";
import { handleSocketConnection } from "./socket/socket.js";

const app = express();
const server = createServer(app);

app.use(cookieParser());
app.use(express.json());

// cors setup
const corsOptions = {
  origin: "https://livepollingclient.onrender.com",
  methods: ["GET", "POST", "DELETE"],
};

app.use(cors({ ...corsOptions, credentials: true }));

export const io = new Server(server, {
  cors: { origin: "https://livepollingclient.onrender.com" },
});

// end cors setup

io.on("connection", handleSocketConnection);

// Routes
app.use("/api/user", userRoute);
app.use("/api/poll", authMiddleware, pollRoute);

app.get("/", (req, res) => {
  res.send("welcome to LivePolling");
});

// Error handler middleware
app.use(errorMiddlware);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening at port ${PORT}`);
});
