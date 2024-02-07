import { customError } from "../middleware/errorHandlerMiddleware.js";
import {
  createPoll,
  deletePoll,
  getAllPoll,
  getPollDetails,
} from "./pollRespository.js";

// create poll
export const createPollCont = async (req, res, next) => {
  try {
    const { roomId, roomName, roomDesc, questions } = req.body;

    // Check if roomId and roomName are provided
    if (roomId === "" || roomName === "") {
      throw new customError(400, "roomId and roomName are required fields");
    }

    // Filter out null questions and options
    const filteredQuestions = questions.filter((question) => {
      // Check if question is not null and not empty
      if (!question.question || question.question.trim() === "") {
        throw new customError(
          400,
          "Each question must have a non-null and non-empty value"
        );
      }

      // Check if options.length is at least 2
      if (question.options.length < 2) {
        throw new customError(
          400,
          "There should be at least 2 options for every question"
        );
      }

      // Remove empty options
      const nonEmptyOptions = question.options.filter(
        (option) => option.trim() !== ""
      );

      // Check if all options are non-empty
      if (nonEmptyOptions.length !== question.options.length) {
        throw new customError(400, "Options cannot be empty");
      }

      // Update question with non-empty options
      question.options = nonEmptyOptions;

      return true; // Include the question in filteredQuestions
    });

    if (filteredQuestions.length === 0) {
      throw new customError(400, "At least one valid question is required");
    }

    const { status, msg } = await createPoll(
      roomId,
      roomName,
      roomDesc,
      filteredQuestions,
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
