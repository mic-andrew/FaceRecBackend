import { Router } from "express";
import authRoutes from "../auth/routes"
import faceRecognitionRoutes from "../faceRecognition/routes"
import facialEmotionRoutes from "../emotionRecognition/routes"

const router = Router();

router.use("/auth", authRoutes);
router.use("/face-recognition", faceRecognitionRoutes);
router.use("/facial-emotion", facialEmotionRoutes);



export default router;

