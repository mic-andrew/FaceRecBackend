import { Request, Response } from "express";
import { registerUserService } from "./service";
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

const login = (req: Request, res: Response) => {};

export { registerUser, login };
