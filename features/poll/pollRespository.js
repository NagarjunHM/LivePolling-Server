import pollModel from "./pollSchema.js";
import userModel from "../user/userSchema.js";
import { customError } from "../middleware/errorHandlerMiddleware.js";

// create new poll
export const createPoll = async (roomId, roomName, questions, user) => {
  try {
    if (roomId && roomName && questions && user) {
      const newPollData = new pollModel({
        roomId,
        roomName,
        questions,
        user,
      });
      await newPollData.save();

      if (newPollData) {
        //   saving the poll refrence in the user model
        const loggedUser = await userModel.findById(user);

        if (!loggedUser) {
          throw new customError(400, "user not found");
        }

        loggedUser.polls.push(newPollData._id);
        await loggedUser.save();
        
        return { status: 200, msg: { msg: "poll saved", poll: newPollData } };
      } else {
        throw new customError(400, "failed to store poll");
      }
    } else {
      throw new customError(
        400,
        "question, options, correctAnswer, all are required fields"
      );
    }
  } catch (err) {
    throw err;
  }
};

// get all polls of a specific user
export const getAllPoll = async (user) => {
  try {
    const allPolls = await pollModel.find({ user });
    if (allPolls) {
      if (allPolls.length > 0) {
        return { status: 200, msg: allPolls };
      } else {
        return { status: 200, msg: "no polls found" };
      }
    } else {
      throw new customError(404, "polls not present");
    }
  } catch (err) {
    throw err;
  }
};

// get specific poll details
export const getPollDetails = async (user, pollId) => {
  try {
    const pollDetails = await pollModel.findOne({ user, _id: pollId });

    if (pollDetails) {
      return { status: 200, msg: pollDetails };
    } else {
      throw new customError(404, "poll not found");
    }
  } catch (err) {
    throw err;
  }
};

// delete a specific poll
export const deletePoll = async (user, pollId) => {
  try {
    const deletedPoll = await pollModel.findOneAndDelete({ user, _id: pollId });

    if (deletedPoll) {
      const user = await userModel.findById(deletedPoll.user);

      //   removing the poll refrence from the userModel
      user.polls.splice(deletePoll._id, 1);
      await user.save();

      return { status: 200, msg: "poll deleted successfully" };
    } else {
      throw new customError(404, "poll not found");
    }
  } catch (err) {
    throw err;
  }
};
