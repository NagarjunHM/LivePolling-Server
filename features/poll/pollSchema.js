import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [
      { optionsText: { type: String, required: true } },
      { votes: { type: Number, default: 0 } },
    ],
    required: true,
  },
  correctAnswer: {
    type: Number,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const pollModel = mongoose.model("Poll", pollSchema);

export default pollModel;
