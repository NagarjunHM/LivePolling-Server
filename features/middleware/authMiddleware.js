import jwt from "jsonwebtoken";

import { customError } from "./errorHandlerMiddleware.js";
import userModel from "../user/userSchema.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new customError(401, "Unauthorized - Missing token"));
  }

  try {
    const { username } = await jwt.verify(token, process.env.TOKEN_SCRETE);

    const validUser = await userModel.findOne({ username });

    if (validUser.token.includes(token)) {
      req.username = username;
      next();
    } else {
      throw new customError(401, "Unauthorized - token expired");
    }
  } catch (err) {
    next(err);
  }
};
