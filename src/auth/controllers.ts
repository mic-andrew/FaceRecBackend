import { Request, Response } from "express";
import { loginService, registerUserService } from "./service";
import { IUser } from "../types/userTypes";

const registerUser = async (req: Request, res: Response) => {
  const userData: IUser = req.body;
  if (req.file) {
    userData.profileImage = req.file.path;
  }
  const response: any = await registerUserService(userData);
  if (response.success) {
    res.status(201).json({
      message: response.message,
      data: response.data,
      success: response.success,
    });
  } else {
    res.send({ message: response.message, error: response.error });
  }
};

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response: any = await loginService(email, password);
  console.log(response);
  if (response.success === true) {
    res.status(201).json(response);
  } else {
    res.status(409).json(response);
  }
};

export { registerUser, loginController };
