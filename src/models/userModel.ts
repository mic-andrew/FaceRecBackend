import { Schema } from "mongoose";

export const users = new Schema({
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
    required: false,
    type: String,
  },
  profile_image: {},
  phone_number: {
    required: true,
    type: Number,
  },
  gender: {
    required: true,
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "teacher", "student", "principal","vice_principal"],
    required: true,
  },
});
