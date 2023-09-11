import { Router } from "express";
import { registerUser } from "../auth/controllers"


const router = Router();


router.post("/register", registerUser)

export default router;
