import pollModel from "./pollSchema.js";
import userModel from "../user/userSchema.js";
import { customError } from "../middleware/errorHandlerMiddleware.js";

// create new poll
export const createPoll = async (
  roomId,
  roomName,
  roomDesc,
  questions,
  user
) => {
  try {
    const newPollData = new pollModel({
      roomId,
      roomName,
      roomDesc,
      questions,
      user,
    });

    questions.map((question) => {
      if (question === "" || question.options.length < 2) {
        throw new customError(
          400,
          "question cannot be null | there should be atleast 2 options"
        );
      }
    });
    await newPollData.save();
    console.log(newPollData);
    if (newPollData) {
      const loggedUser = await userModel.findById(user);

      if (!loggedUser) {
        throw new customError(400, "user not found");
      }

      // saving the poll reference to the user model
      loggedUser.polls.push(newPollData._id);
      await loggedUser.save();

      return { status: 200, msg: { msg: "poll saved", poll: newPollData } };
    } else {
      throw new customError(400, "failed to store poll");
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
        return { status: 200, msg: [] };
      }
    } else {
      throw new customError(404, "polls not present");
    }
  } catch (err) {
    throw err;
  }
};

// get specific poll details
export const getPollDetails = async (user, roomId) => {
  try {
    const pollDetails = await pollModel.findOne({ user, roomId });

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
export const deletePoll = async (user, roomId) => {
  try {
    const deletedPoll = await pollModel.findOneAndDelete({ user, roomId });

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

// update the schema with participants vote
export const updateUserVotes = async (roomId, userAnswer) => {
  try {
    const pollDetails = await pollModel.findOne({ roomId });

    // Iterate through userAnswer and update votes
    userAnswer.forEach((ans) => {
      const { pollIndex, optionIndex } = ans;

      // Update userAnswer for the corresponding question
      pollDetails.questions[pollIndex].userAnswer.push(optionIndex);

      // Update votes based on userAnswer
      const optionKey = optionIndex.toString();
      const votesMap = pollDetails.questions[pollIndex].votes || new Map();

      votesMap.set(optionKey, (votesMap.get(optionKey) || 0) + 1);

      // Save the updated votes Map to the question
      pollDetails.questions[pollIndex].votes = votesMap;
    });

    // Save the updated pollDetails to the database
    const updatedPollDetails = await pollDetails.save();

    return updatedPollDetails;
  } catch (err) {
    throw err;
  }
};
