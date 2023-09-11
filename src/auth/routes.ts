import { Router } from "express";
import { registerUser } from "../auth/controllers"


const router = Router();


router.get("/register", registerUser)

export default router;
