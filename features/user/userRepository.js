import userModel from "./userSchema.js";
import { customError } from "../middleware/errorHandlerMiddleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// generate new accessToken and refreshToken
const generateToken = (id, name, email) => {
  const accessTokenExpiresIn = "10m";
  const refreshTokenExpiresIn = "1d";
  try {
    const accessToken = jwt.sign(
      {
        id,
        name,
        email,
      },
      process.env.TOKEN_SCRETE,
      {
        expiresIn: accessTokenExpiresIn,
      }
    );

    const refreshToken = jwt.sign({ id }, process.env.TOKEN_SCRETE, {
      expiresIn: refreshTokenExpiresIn,
    });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new customError(500, err);
  }
};

// register user
export const registerUser = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new customError(400, "Name, email, and password are required fields");
  }

  // Checking whether the password matches the pattern
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  const isPasswordValid = passwordRegex.test(password);

  if (!isPasswordValid) {
    throw new customError(
      400,
      "Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long."
    );
  }

  try {
    // Hashing plain password asynchronously
    const hash = await bcrypt.hash(password, 10);

    // Saving the hashPassword into the database
    const newUser = new userModel({ name, email, password: hash });
    await newUser.save();
  } catch (err) {
    throw new customError(400, err);
  }
};

// login user
export const loginUser = async (email, password) => {
  try {
    const validUser = await userModel.findOne({ email });

    if (validUser) {
      if (await bcrypt.compare(password, validUser.password)) {
        // generating the jwt accessToken and refreshToken

        const { accessToken, refreshToken } = generateToken(
          validUser._id,
          validUser.name,
          validUser.email
        );

        // saving the refreshToken in the userModel
        validUser.refreshToken = refreshToken;
        await validUser.save();

        return {
          status: 200,
          msg: { msg: "user login successfull", accessToken },
          refreshToken,
        };
      }
      // password does not match
      throw new customError(401, "password does not match");
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
      user.refreshToken = "";
      await user.save();

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
      validUser._id,
      validUser.name,
      validUser.email
    );

    // saving the refreshed token into database
    validUser.refreshToken = refreshToken;
    await validUser.save();

    return {
      status: 200,
      msg: { msg: "token refreshed", accessToken },
      refreshToken,
    };
  } catch (err) {
    throw err;
  }
};
