import { Schema } from "mongoose";
import { IUser } from "../types/userTypes";

export const User = new Schema<IUser>({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  middleName: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: { type: String, required: true },

  profileImage: {},
  phoneNumber: {
    required: false,
    type: Number,
  },
  gender: {
    required: true,
    type: String,
  },
  stateOfOrigin: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "teacher", "student", "principal", "vice_principal"],
    required: true,
  },
  token: {
    type: String,
  },
  parentNumber: {
    type: String,
  },
  address: {
    type: String,
  },
});
