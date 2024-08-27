// controllers/patientController.ts
import { Request, Response } from 'express';
import { patientService } from './service';
import { IPatientData } from '../models/Patient';
import mongoose from 'mongoose';

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
      doctorId: data.doctorId,

    };
  }

  addPatient = async (req: Request, res: Response): Promise<void> => {
    try {
      const patientCount = await patientService.getPatientCount();
      console.log("patientCount", patientCount);
      const anonymizedData = this.anonymizeData(req.body, patientCount + 1);
      console.log("anonymizedData in Func", anonymizedData);
      anonymizedData.diagnosis = ""
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
import { Patient } from '../models/Patient';
import User from '../models/User';

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

  async attachPatient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { patientId } = req.body;

      const doctor = await Doctor.findById(id);
      const patient = await Patient.findById(patientId);

      if (!doctor || !patient) {
        res.status(404).json({ message: 'Doctor or Patient not found' });
        return;
      }

      if (!doctor.patients) {
        doctor.patients = [];
      }

      if (doctor.patients.includes(new mongoose.Types.ObjectId(patientId))) {
        res.status(400).json({ message: 'Patient already attached to this doctor' });
        return;
      }

      doctor.patients.push(new mongoose.Types.ObjectId(patientId));
      await doctor.save();

      patient.doctor = new mongoose.Types.ObjectId(id);
      await patient.save();

      res.json({ message: 'Patient attached successfully', doctor });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }


  getMyPatients = async (req:any, res:any) => {
    try {
      const userId = req.params.id;
      const doctorUser = await User.findById(userId)
      const doctorId = doctorUser?.doctorProfile;
      const doctor = await Doctor.findById(doctorId).populate('patients');
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.json(doctor.patients);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  };
  
 
  addDiagnosis = async (req:any, res:any) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      patient.diagnosis = req.body.diagnosis;
      await patient.save();
      res.json(patient);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  };
  
}

export const doctorController = new DoctorController();

export const patientController = new PatientController();