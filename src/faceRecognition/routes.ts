import express from 'express';
import { recognizeFace } from './controllers';

const router = express.Router();

router.post('/recognize', recognizeFace);

export default router;