import { registerUser, loginUser, logoutUser } from "./userRepository.js";
import { customError } from "../middleware/errorHandlerMiddleware.js";

// register new user
export const registerUserCont = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // console.log(name, email, password);
    const { status, msg } = await registerUser(name, email, password);
    res.status(status).json(msg);
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

    const { status, msg } = await loginUser(req.body.email, req.body.password);

    res.status(status).json(msg);
  } catch (err) {
    next(err);
  }
};

// logout user
export const logoutUserCont = async (req, res, next) => {
  try {
    const { status, msg } = await logoutUser(req.id, req.token);

    res.status(status).json(msg);
  } catch (err) {
    next(err);
  }
};
