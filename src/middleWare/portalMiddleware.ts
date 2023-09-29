import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { models } from "../models";
import { jwtSecret } from "../app";

export const authenticateUserWithJWT =
  (requiredRole: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    jwt.verify(token, jwtSecret, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send("Unauthorized");
      }

      const { userId } = decoded as any;

      const matchingUser = await models.User.findById(userId);

      if (!matchingUser) return res.status(401).send("Unauthorized");
      if (matchingUser.role !== requiredRole)
        return res.status(401).send("Unauthorized");
      return next();
    });
  };
