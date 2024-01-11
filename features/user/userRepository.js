import userModel from "./userSchema.js";
import { customError } from "../middleware/errorHandlerMiddleware.js";
import jwt from "jsonwebtoken";

// register user
export const registerUser = async ({ username, password }) => {
  try {
    const newUser = new userModel({ username, password });
    await newUser.save();
  } catch (err) {
    throw err;
  }
};

// login user
export const loginUser = async ({ username, password }) => {
  try {
    const validUser = await userModel.findOne({ username });
    if (validUser) {
      if (validUser.password.trim() === password.trim()) {
        // generating the jwt token
        const token = jwt.sign({ username }, process.env.TOKEN_SCRETE, {
          expiresIn: 60 * 60 * 24,
        });

        validUser.token.push(token);
        await validUser.save();
        return { status: 200, msg: { msg: "user found", accessToken: token } };
      }
      // password does not match
      throw new customError(400, "password does not match");
    }
    throw new customError(404, "user not found");
  } catch (err) {
    throw err;
  }
};

// logout user
export const logoutUser = async (username, token) => {
  try {
    const user = await userModel.findOne({ username });

    // checking if the token exists
    if (user.token.includes(token)) {
      user.token.splice(token, 1);
      await user.save();
      return { status: 200, msg: "logout successful" };
    } else {
      throw new customError("401", "Unauthorized - Missing token");
    }
  } catch (err) {
    throw err;
  }
};
