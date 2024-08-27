// controllers/authController.ts
import { Request, Response } from 'express';
import authService from './service';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error:any) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
      res.json({ user: { id: user._id, name: user.name, email: user.email, userType: user.userType }, token });
    } catch (error:any) {
      res.status(401).json({ message: error.message });
    }
  }
}

export default new AuthController();