import {
  registerUser,
  loginUser,
  logoutUser,
  storeRefreshToken,
} from "./userRepository.js";
import { customError } from "../middleware/errorHandlerMiddleware.js";

// register new user
export const registerUserCont = async (req, res, next) => {
  try {
    await registerUser(req.body);
    res.status(200).json({ message: "user registered successfully" });
  } catch (err) {
    next(err);
  }
};

// login user
export const loginUserCont = async (req, res, next) => {
  try {
    const { status, msg } = await loginUser(req.body);

    res
      .cookie("accessToken", msg.accessToken, { httpOnly: true })
      .cookie("refreshToken", msg.refreshToken, { httpOnly: true })
      .status(status)
      .json(msg);
  } catch (err) {
    next(err);
  }
};

// logout user
export const logoutUserCont = async (req, res, next) => {
  try {
    const { status, msg } = await logoutUser(req.id);

    res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(status)
      .json(msg);
  } catch (err) {
    next(err);
  }
};

// geneate new access token
export const generateNewAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new customError(401, "refresh token missing");
    }

    const { status, msg } = await storeRefreshToken(refreshToken);

    res
      .cookie("accessToken", msg.accessToken, { httpOnly: true })
      .cookie("refreshToken", msg.refreshToken, { httpOnly: true })
      .status(status)
      .json(msg);
  } catch (err) {
    next(err);
  }
};
