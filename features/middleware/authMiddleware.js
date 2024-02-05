import jwt from "jsonwebtoken";

import { customError } from "./errorHandlerMiddleware.js";
import { checkToken } from "../token/tokenRepository.js";
import userModel from "../user/userSchema.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new customError(401, "Unauthorized - missing token"));
  }

  const notValidToken = await checkToken(token);

  if (notValidToken) {
    return next(new customError(403, "invalid token"));
  }

  try {
    const { name, email } = jwt.verify(token, process.env.TOKEN_SCRETE);

    const validUser = await userModel.findOne({ email });

    req.id = validUser._id;
    req.email = validUser.email;
    req.name = validUser.name;
    req.token = token;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new customError(401, "Token has expired"));
    }

    // Handle other errors here
    return next(new customError(500, "Internal Server Error"));
  }
};
