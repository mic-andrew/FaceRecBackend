import { Schema } from "mongoose";

export const User = new Schema({
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
});
