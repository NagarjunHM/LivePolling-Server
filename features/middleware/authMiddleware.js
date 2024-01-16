import jwt from "jsonwebtoken";

import { customError } from "./errorHandlerMiddleware.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(new customError(401, "Unauthorized - missing access token"));
  }

  try {
    const { id, name, email } = jwt.verify(token, process.env.TOKEN_SCRETE);

    if (id) {
      req.id = id;
      req.name = name;
      req.email = email;
      req.token = token;
      next();
    } else {
      throw new customError(401, "Unauthorized - access token expired");
    }
  } catch (err) {
    throw new customError(401, "Invalid token");
  }
};
