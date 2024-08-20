// routes/patientRoutes.ts
import express from 'express';
import { patientController } from './controllers';

const router = express.Router();

router.get('/patients', patientController.getPatients.bind(patientController));
router.post('/patients', patientController.addPatient);  // No need to bind this one as it's an arrow function
router.delete('/:id', patientController.deletePatient.bind(patientController));

export default router;