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
    const { name, email, password } = req.body;
    await registerUser(name, email, password);
    res.status(201).json({ message: "user registered successfully" });
  } catch (err) {
    next(err);
  }
};

// login user
export const loginUserCont = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw new customError(400, "email and password in required");
    }

    const { status, msg, refreshToken } = await loginUser(
      req.body.email,
      req.body.password
    );

    res
      .cookie("refreshToken", refreshToken, { httpOnly: true })
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

    res.clearCookie("refreshToken").status(status).json(msg);
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
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .status(status)
      .json(msg);
  } catch (err) {
    next(err);
  }
};
