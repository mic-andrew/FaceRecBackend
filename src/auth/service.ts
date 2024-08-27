// services/authService.ts
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { Doctor, IDoctor } from '../models/Doctor';
import mongoose from 'mongoose';

interface UserData {
  name: string;
  email: string;
  password: string;
  userType: 'patient' | 'doctor' | 'admin';
  specialty?: string;
  licenseNumber?: string;
  employeeId?: string;
  dateOfBirth?: Date;
  department?: string;
}

interface LoginResult {
  user: IUser;
  token: string;
}


class AuthService {
  async register(userData: UserData): Promise<IUser> {
    const { email, userType } = userData;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = new User(userData);
      await user.save({ session });

      if (userType === 'doctor') {
        const doctorData: Partial<IDoctor> = {
          name: userData.name,
          specialty: userData.specialty,
          department: userData.department,
          experience: 0, // You might want to add this to UserData if needed
          contact: userData.email,
          avatar: '', // You can set a default avatar or leave it empty
        };
        
        const doctor = new Doctor({
          ...doctorData,
          user: user._id
        });
        await doctor.save({ session });

        // Update user with doctor reference
        user.doctorProfile = doctor._id;
        await user.save({ session });
      }

      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET! || "3y6T$#r9D@2sP!zW", {
      expiresIn: '1d'
    });
    return { user, token };
  }
}

export default new AuthService();