import { models } from "../models";
import { IUser } from "../types/userTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../app";

const createRole = async (userId: any, role: string, userData: any) => {
  switch (role) {
    case "student":
      await models.Student.create({
        user: userId,
        ...userData,
      });
      break;
    case "teacher":
      await models.Teacher.create({ user: userId, ...userData });
      break;
    case "principal":
      await models.Principal.create({ user: userId, ...userData });
      break;
    case "admin":
      await models.Admin.create({ user: userId, ...userData });
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
      return { error: true, message: "Email already exists" };
    }
    const encryptedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = encryptedPassword;
    const newUser = new models.User(userData);  
    await newUser.save();

    const userId = newUser._id;

    await createRole(userId, userData.role, userData);

    return {
      success: true,
      message: `${userData.role} created successfully`,
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
    const existingUser: any = await models.User.findOne(userDetails);

    console.log(existingUser);

    if (existingUser) {
      const decodedPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (decodedPassword) {
        console.log("decodedPassword ", decodedPassword);
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
      }
    } else {
      return { error: true, message: "Invalid Email or Password" };
    }
  } catch (error) {
    return { error: true, message: error };
  }
};
