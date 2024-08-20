// controllers/patientController.ts
import { Request, Response } from 'express';
import { patientService } from './service';
import { IPatientData } from '../models/Patient';

export class PatientController {
  async getPatients(req: Request, res: Response): Promise<void> {
    try {
      const patients = await patientService.getAllPatients();
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  private anonymizeData = (data: IPatientData, newPatientNumber: number): IPatientData => {
    console.log("anonymizeData", data, newPatientNumber);
    return {
      name: `Patient ${newPatientNumber}`,
      phone: data.phone.slice(0, 3) + "xxxx" + data.phone.slice(-4),
      date: data.date,
      age: data.age,
      clinic: data.clinic,
      diagnosis: data.diagnosis,
    };
  }

  addPatient = async (req: Request, res: Response): Promise<void> => {
    try {
      const patientCount = await patientService.getPatientCount();
      console.log("patientCount", patientCount);
      const anonymizedData = this.anonymizeData(req.body, patientCount + 1);
      console.log("anonymizedData in Func", anonymizedData);
      const newPatient = await patientService.addPatient(anonymizedData);
      res.status(201).json(newPatient);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deletePatient(req: Request, res: Response): Promise<void> {
    try {
      await patientService.deletePatient(req.params.id);
      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export const patientController = new PatientController();