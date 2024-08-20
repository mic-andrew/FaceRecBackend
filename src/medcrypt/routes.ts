// routes/patientRoutes.ts
import express from 'express';
import { patientController,doctorController } from './controllers';

const router = express.Router();

router.get('/patients', patientController.getPatients.bind(patientController));
router.post('/patients', patientController.addPatient);  // No need to bind this one as it's an arrow function
router.delete('/:id', patientController.deletePatient.bind(patientController));



router.get('/doctors', doctorController.getAllDoctors);
router.post('/doctors', doctorController.addDoctor);
router.get('/:doctors', doctorController.getDoctorById);
router.put('/doctors:id', doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor);


export default router;