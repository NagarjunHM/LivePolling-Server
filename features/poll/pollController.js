import { customError } from "../middleware/errorHandlerMiddleware.js";
import {
  createPoll,
  deletePoll,
  getAllPoll,
  getPollDetails,
} from "./pollRespository.js";

// create new poll
export const createPollCont = async (req, res, next) => {
  try {
    const { roomId, roomName, roomDesc, questions } = req.body;

    if (
      roomId === "" ||
      roomName === "" ||
      Object.keys(questions).length === 0
    ) {
      throw new customError(
        400,
        "roomId, roomName, qestions are all required fields...!"
      );
    }
    const { status, msg } = await createPoll(
      roomId,
      roomName,
      roomDesc,
      questions,
      req.id
    );

    res.status(status).json(msg);
  } catch (err) {
    next(err);
  }
};

// get all poll of a specific user
export const getAllPollCont = async (req, res, next) => {
  try {
    const { status, msg } = await getAllPoll(req.id);
    res.status(status).json(msg);
  } catch (err) {
    next(err);
  }
};

// get details of a specific user
export const getPollDetailsCont = async (req, res, next) => {
  try {
    // console.log(req.params.roomId);
    const { status, msg } = await getPollDetails(req.id, req.params.roomId);
    res.status(status).json(msg);
  } catch (err) {
    next(err);
  }
};

// delete specific poll
export const deletePollCont = async (req, res, next) => {
  try {
    const { status, msg } = await deletePoll(req.id, req.params.roomId);
    res.status(status).json(msg);
  } catch (err) {
    next(err);
  }
};
