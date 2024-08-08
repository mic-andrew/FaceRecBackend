import { Request, Response } from "express";
import { loginService, registerUserService } from "./service";
import { IUser } from "../types/userTypes";
import { logger } from "../utils";

const registerUser = async (req: Request, res: Response) => {
  const { firstName, email, password }: IUser = req.body;

  if (!firstName || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const response: any = await registerUserService({ firstName, email, password });
    if (response.success) {
      res.status(201).json({
        message: response.message,
        data: response.data,
        success: response.success,
      });
    } else {
      res.status(400).json({ message: response.message, error: response.error });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const response: any = await loginService(email, password);
    logger(response);

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(401).json(response);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export { registerUser, loginController };
