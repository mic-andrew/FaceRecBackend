import { models } from "../models";
import { IUser } from "../types/userTypes";

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
      // Handle unknown roles or return an error
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
    const newUser = new models.User(userData);
    await newUser.save();

    const userId = newUser._id;

    createRole(userId, userData.role);

    return { success: { message: "User created successfully", user: newUser } };
  } catch (error) {
    console.error(error);
    return { error: { message: error } };
  }
};
