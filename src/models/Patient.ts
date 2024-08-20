// models/Patient.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPatientData {
  name: string;
  phone: string;
  date: string;
  age: string;
  clinic: string;
  diagnosis: string;
}

export interface IPatient extends IPatientData, Document {}

const patientSchema = new Schema<IPatient>({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  clinic: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Patient = mongoose.model<IPatient>('Patient', patientSchema);