import userModel from "./userSchema.js";
import { customError } from "../middleware/errorHandlerMiddleware.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { addRevokedToken } from "../token/tokenRepository.js";

// generate new accessToken and refreshToken
const generateToken = (name, email) => {
  try {
    const token = jwt.sign(
      {
        name,
        email,
      },
      process.env.TOKEN_SCRETE,
      {
        expiresIn: "1d",
      }
    );

    return token;
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
    if (err.code == 11000) {
      throw new customError(400, "Email already exists");
    } else {
      throw err;
    }
  }
};

// login user
export const loginUser = async (email, password) => {
  try {
    const validUser = await userModel.findOne({ email });

    if (validUser) {
      if (await bcrypt.compare(password, validUser.password)) {
        // generating the jwt accessToken and refreshToken

        const token = generateToken(validUser.name, validUser.email);

        return {
          status: 200,
          msg: {
            msg: "user login successfull",
            email: validUser.email,
            token,
          },
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
export const logoutUser = async (id, token) => {
  try {
    const user = await userModel.findById(id);

    if (user) {
      const result = await addRevokedToken(token);
      if (result) {
        return { status: 200, msg: { msg: "logout successful" } };
      }
    } else {
      throw new customError("404", "user not found");
    }
  } catch (err) {
    throw err;
  }
};
