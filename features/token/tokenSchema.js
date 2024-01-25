import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: { type: String },
});

export const tokenModel = mongoose.model("Token", tokenSchema);
