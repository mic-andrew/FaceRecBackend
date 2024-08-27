// models/User.ts
import mongoose, { Document, Model,Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  userType: 'patient' | 'doctor' | 'admin';
  specialty?: string;
  licenseNumber?: string;
  employeeId?: string;
  dateOfBirth?: Date;
  doctorProfile?: mongoose.Types.ObjectId;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ['patient', 'doctor', 'admin'] },
  // Fields for doctors
  specialty: { type: String },
  licenseNumber: { type: String },
  // Fields for admins
  employeeId: { type: String },
  // Fields for patients
  dateOfBirth: { type: Date },
  doctorProfile: { type: Schema.Types.ObjectId, ref: 'Doctor' },

}, { timestamps: true });

userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;