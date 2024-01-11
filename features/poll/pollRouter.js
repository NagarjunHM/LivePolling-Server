import express from "express";
import {
  createPollCont,
  deletePollCont,
  getAllPollCont,
  getPollDetailsCont,
} from "./pollController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const pollRoute = express.Router();

pollRoute.post("/", createPollCont);
pollRoute.get("/", getAllPollCont);
pollRoute.get("/:id", getPollDetailsCont);
pollRoute.delete("/:id", deletePollCont);

export default pollRoute;
