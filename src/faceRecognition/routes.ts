import express from 'express';
import { recognizeFace, uploadSuspect } from './controllers';

const router = express.Router();

router.post('/recognize', recognizeFace);
router.post('/upload-suspect', uploadSuspect);
router.post('fetch-suspects', )


export default router;