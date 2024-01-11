import userModel from "./userSchema.js";
import { customError } from "../middleware/errorHandlerMiddleware.js";
import jwt from "jsonwebtoken";

// generate new accessToken and refreshToken
const generateToken = (username, id) => {
  try {
    const accessToken = jwt.sign(
      { username, id: id },
      process.env.TOKEN_SCRETE,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign({ id: id }, process.env.TOKEN_SCRETE, {
      expiresIn: "1d",
    });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new customError(500, err);
  }
};

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
        // generating the jwt accessToken and refreshToken

        const { accessToken, refreshToken } = generateToken(
          validUser.username,
          validUser._id
        );

        validUser.refreshToken = refreshToken;
        await validUser.save();
        return {
          status: 200,
          msg: { msg: "user found", accessToken, refreshToken },
        };
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
export const logoutUser = async (id) => {
  try {
    const user = await userModel.findById(id);

    if (user) {
      return { status: 200, msg: "logout successful" };
    } else {
      throw new customError("404", "user not found");
    }
  } catch (err) {
    throw err;
  }
};

// genearate new access token and store new refresh token
export const storeRefreshToken = async (rToken) => {
  try {
    const { id } = jwt.verify(rToken, process.env.TOKEN_SCRETE);

    if (!id) {
      throw new customError(404, "user not found");
    }

    // checking user in database
    const validUser = await userModel.findById(id);

    if (!validUser) {
      throw new customError(404, "user not found");
    }

    const { accessToken, refreshToken } = generateToken(
      validUser.username,
      validUser._id
    );

    // saving the refreshed token into database
    validUser.refreshToken = refreshToken;
    await validUser.save();

    return {
      status: 200,
      msg: { msg: "token refreshed", accessToken, refreshToken },
    };
  } catch (err) {
    throw err;
  }
};
