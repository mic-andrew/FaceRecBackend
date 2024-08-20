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

// controllers/doctorController.ts
import { Doctor, IDoctor } from '../models/Doctor';

export class DoctorController {
  async getAllDoctors(req: Request, res: Response): Promise<void> {
    try {
      const doctors = await Doctor.find().sort({ name: 1 });
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async addDoctor(req: Request, res: Response): Promise<void> {
    try {
      const newDoctor = new Doctor(req.body);
      const savedDoctor = await newDoctor.save();
      res.status(201).json(savedDoctor);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getDoctorById(req: Request, res: Response): Promise<void> {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        res.status(404).json({ message: 'Doctor not found' });
        return;
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async updateDoctor(req: Request, res: Response): Promise<void> {
    try {
      const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedDoctor) {
        res.status(404).json({ message: 'Doctor not found' });
        return;
      }
      res.json(updatedDoctor);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deleteDoctor(req: Request, res: Response): Promise<void> {
    try {
      const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
      if (!deletedDoctor) {
        res.status(404).json({ message: 'Doctor not found' });
        return;
      }
      res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export const doctorController = new DoctorController();

export const patientController = new PatientController();