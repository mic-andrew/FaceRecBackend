// models/Patient.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPatientData {
  name: string;
  phone: string;
  date: string;
  age: string;
  clinic: string;
  diagnosis: string | null;
  doctorId?: mongoose.Types.ObjectId;
}

export interface IPatient extends Document, Omit<IPatientData, 'doctorId'> {
  doctor?: mongoose.Types.ObjectId;
}

const patientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  age: { type: String, required: true },
  clinic: { type: String, required: true },
  diagnosis: { type: String, required: false },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' }
}, { timestamps: true });

export const Patient = mongoose.model<IPatient>('Patient', patientSchema);