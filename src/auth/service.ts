import { models } from "../models";
import { IUser } from "../types/userTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../app";

const createRole = async (userId: any, role: string) => {
  switch (role) {
    case "student":
      await models.Student.create({
        user: userId,
        parentPhoneNumber: "parentPhoneNumber",
        classRoom: 1,
      });
      break;
    case "teacher":
      await models.Teacher.create({ user: userId });
      break;
    case "principal":
      await models.Principal.create({ user: userId });
      break;
    case "admin":
      await models.Admin.create({ user: userId });
      break;
    default:
      throw new Error("Unknown role");
  }
};

export const registerUserService = async (userData: IUser) => {
  try {
    const existingUser: IUser | null = await models.User.findOne({
      email: userData.email,
    });

    if (existingUser) {
      return { error: { message: "Email already exists" } };
    }
    const encryptedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = encryptedPassword;
    const newUser = new models.User(userData);
    await newUser.save();

    const userId = newUser._id;

    createRole(userId, userData.role);

    return {
      success: true,
      message: "User created successfully",
      data: newUser,
    };
  } catch (error) {
    console.error(error);
    return { error: true, message: error };
  }
};

export const loginService = async (email: string, password: string) => {
  try {
    const userDetails = { email, password };
    const existingUser: any = await models.User.findOne(userDetails);
    const decodedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (existingUser) {
      const token = await jwt.sign(existingUser, jwtSecret, {
        expiresIn: "1h",
      });
      existingUser.token = token;

      return {
        success: true,
        message: `Welcome back ${existingUser.firstName}`,
        data: existingUser,
      };
    } else {
      return { error: true, message: "Invalid Email or Password" };
    }
  } catch (error) {
    return { error: true, message: "something went wrong" };
  }
};
