import {
  createPoll,
  deletePoll,
  getAllPoll,
  getPollDetails,
} from "./pollRespository.js";

// create new poll
export const createPollCont = async (req, res, next) => {
  try {
    const { question, options, correctAnswer } = req.body;
    const { status, msg } = await createPoll(
      question,
      options,
      correctAnswer,
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
    const { status, msg } = await getPollDetails(req.id, req.params.id);
    res.status(status).json(msg);
  } catch (err) {
    next(err);
  }
};

// delete specific poll
export const deletePollCont = async (req, res, next) => {
  try {
    const { status, msg } = await deletePoll(req.id, req.params.id);
    res.status(status).json(msg);
  } catch (err) {
    next(err);
  }
};
