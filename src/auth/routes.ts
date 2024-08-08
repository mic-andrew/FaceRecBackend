import { Router } from "express";
import { loginController, registerUser } from "../auth/controllers";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginController);

export default router;
