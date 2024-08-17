import express from 'express';
import { getSuspects, recognizeFace, uploadSuspect } from './controllers';

const router = express.Router();

router.post('/recognize', recognizeFace);
router.post('/upload-suspect', uploadSuspect);
router.get('/fetch-suspects', getSuspects)


export default router;