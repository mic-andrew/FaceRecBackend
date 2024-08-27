// services/patientService.ts
import { IPatient, IPatientData, Patient } from '../models/Patient';
import { Doctor } from '../models/Doctor'; // Assuming you have a Doctor model

export class PatientService {
  async getAllPatients(): Promise<IPatient[]> {
    return await Patient.find().sort({ createdAt: -1 }).populate('doctor', 'name');
  }

  async addPatient(patientData: IPatientData): Promise<IPatient> {
    const { doctorId, ...patientInfo } = patientData;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    const patient = new Patient({
      ...patientInfo,
      doctor: doctorId,
    });
    return await patient.save();
  }

  async deletePatient(id: string): Promise<IPatient | null> {
    return await Patient.findByIdAndDelete(id);
  }

  async getPatientCount(): Promise<number> {
    return await Patient.countDocuments();
  }

  async getPatientsByDoctor(doctorId: string): Promise<IPatient[]> {
    return await Patient.find({ doctor: doctorId }).sort({ createdAt: -1 });
  }

  async attachPatient(req: any, res: any): Promise<void> {
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

      if (doctor.patients.includes(patientId)) {
        res.status(400).json({ message: 'Patient already attached to this doctor' });
        return;
      }

      doctor.patients.push(patientId);
      await doctor.save();

      patient.doctor = id;
      await patient.save();

      res.json({ message: 'Patient attached successfully', doctor });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export const patientService = new PatientService();
