import { models } from "../models";
import { IUser } from "../types/userTypes";

export const registerUserService = async (userData: IUser) => {
  try {
    const existingUser: IUser | null = await models.User.findOne({
      email: userData.email,
    });

    if (existingUser) {
      return { error: { message: "Email already exists" } };
    }
    const newUser = new models.User(userData);
    await newUser.save();

    return { success: { message: "User created successfully", user: newUser } };
  } catch (error) {
    console.error(error);
      return { error: { message: error } };
  }
};
