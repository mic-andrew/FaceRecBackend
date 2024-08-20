// services/patientService.ts
import { IPatient, IPatientData, Patient } from '../models/Patient';

export class PatientService {
  async getAllPatients(): Promise<IPatient[]> {
    return await Patient.find().sort({ createdAt: -1 });
  }

  async addPatient(patientData: IPatientData): Promise<IPatient> {
    const patient = new Patient(patientData);
    return await patient.save();
  }

  async deletePatient(id: string): Promise<IPatient | null> {
    return await Patient.findByIdAndDelete(id);
  }

  async getPatientCount(): Promise<number> {
    return await Patient.countDocuments();
  }
}

export const patientService = new PatientService();