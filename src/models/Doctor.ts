// models/Doctor.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  department: string;
  specialty: string;
  experience: number;
  contact: string;
  avatar?: string;
}

const doctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  department: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: { type: Number, required: true },
  contact: { type: String, required: true },
  avatar: { type: String }
}, { timestamps: true });

export const Doctor = mongoose.model<IDoctor>('Doctor', doctorSchema);