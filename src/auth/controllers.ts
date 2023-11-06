import { Request, Response } from "express";
import { loginService, registerUserService } from "./service";
import { IUser } from "../types/userTypes";
import { logger } from "../utils";

const registerUser = async (req: Request, res: Response) => {
  const userData: IUser = req.body;
  if (req.file) {
    userData.profileImage = req.file.filename;
  }
  const response: any = await registerUserService(userData);
  try {
    if (response.success) {
      res.status(201).json({
        message: response.message,
        data: response.data,
        success: response.success,
      });
    } else {
      res.send({ message: response.message, error: response.error });
    }
  } catch (err) {
    throw err;
  }
};

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const response: any = await loginService(email, password);
    logger(response)
    console.log("response", response);
    if (response.success === true) {
      res.status(201).json(response);
      console.log(response);
    } else {
      res.status(409).json(response);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { registerUser, loginController };
