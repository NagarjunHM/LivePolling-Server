import { tokenModel } from "./tokenSchema.js";

export const addRevokedToken = async (token) => {
  try {
    const revokedToken = new tokenModel({ token });
    await revokedToken.save();
    return true;
  } catch (err) {
    throw err;
  }
};

// function to check weather the token is present in revoked list

export const checkToken = async (token) => {
  try {
    const revokedToken = await tokenModel.findOne({ token });
    console.log(revokedToken);
    return !!revokedToken;
  } catch (err) {
    throw err;
  }
};
