import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  roomName: { type: String, required: true },
  roomDesc: { type: String },
  questions: [
    {
      question: { type: String, default: "" },
      options: { type: [String], default: [] },
      correctAnswerIndex: {
        type: Number,
        default: -1,
      },
      userAnswer: { type: [Number], default: [] },
      votes: { type: Map, of: Number },
    },
  ],

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const pollModel = mongoose.model("Poll", pollSchema);

export default pollModel;
