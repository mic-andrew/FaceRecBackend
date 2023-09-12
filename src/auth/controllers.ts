import { Request, Response } from "express";
import { loginService, registerUserService } from "./service";
import { IUser } from "../types/userTypes";

const registerUser = async (req: Request, res: Response) => {
  const userData: IUser = req.body;
  const response: any = await registerUserService(userData);
  if (response.success) {
    res
      .status(201)
      .json({ message: response.success.message, user: response.success.user });
  } else {
    res.status(400).json({ message: response.error.message });
  }
};

const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response: any = loginService(email, password);
  console.log(response);
  if (response.success === true) {
    res.status(201).json(response);
  } else {
    res.status(400).json(response);
  }
};

export { registerUser, loginController };
