import { models } from "../models";
import { IUser } from "../types/userTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../app";
import { logger } from "../utils";


export const registerUserService = async (userData: IUser) => {
  userData?.email?.toLowerCase();

  try {
    const existingUser: IUser | null = await models.User.findOne({
      email: userData.email,
    });

    if (existingUser) {
      return { error: true, message: "Email already exists" };
    }
    const encryptedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = encryptedPassword;
    const newUser = new models.User(userData);
    await newUser.save();

    const userId = newUser._id;


    return {
      success: true,
      message: `${userData.firstName} created successfully`,
      data: newUser,
    };
  } catch (error) {
    console.error(error);
    return { error: true, message: error };
  }
};

export const loginService = async (email: string, password: string) => {
  try {
    const userDetails = { email };
    email.toLowerCase();

    const existingUser: any = await models.User.findOne(userDetails);


    if (existingUser) {
      const decodedPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (decodedPassword) {

        const userId = existingUser._id;

        const token = await jwt.sign({ userId }, jwtSecret, {
          expiresIn: "12h",
        });
        existingUser.token = token;
        return {
          success: true,
          message: `Welcome back ${existingUser.firstName}`,
          data: existingUser,
        };
      } else {
        return {
          success: false,
          message: "Invalid Email or Password",
        };
      }
    } else {
      return {
        success: false,
        message: "Invalid Email or Password",
      };
    }
  } catch (error) {
    logger(error);

    return { error: true, message: error };
  }
};
