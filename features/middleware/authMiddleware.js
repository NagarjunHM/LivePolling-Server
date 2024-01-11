import jwt from "jsonwebtoken";

import { customError } from "./errorHandlerMiddleware.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(new customError(401, "Unauthorized - missing access token"));
  }

  try {
    const { username, id } = jwt.verify(token, process.env.TOKEN_SCRETE);

    if (username && id) {
      req.username = username;
      req.id = id;
      next();
    } else {
      throw new customError(401, "Unauthorized - access token expired");
    }
  } catch (err) {
    throw new customError(401, "Unauthorized - access token expired");
  }
};
