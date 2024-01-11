import { registerUser, loginUser } from "./userRepository.js";

export const registerUserCont = async (req, res, next) => {
  try {
    await registerUser(req.body);
    res.status(200).json({ message: "user registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const loginUserCont = async (req, res, next) => {
  try {
    const { status, msg } = await loginUser(req.body);

    // storing token in cookies
    res.cookie("token", msg.accessToken, { maxAge: 1000 * 60 * 60 * 24 });
    res.status(status).json(msg);
  } catch (err) {
    next(err);
  }
};
