import express from "express";
import {
  createPollCont,
  deletePollCont,
  getAllPollCont,
  getPollDetailsCont,
} from "./pollController.js";

const pollRoute = express.Router();

pollRoute.post("/", createPollCont);
pollRoute.get("/", getAllPollCont);
pollRoute.get("/:roomId", getPollDetailsCont);
pollRoute.delete("/:roomId", deletePollCont);

export default pollRoute;
