import { model } from "mongoose";
import { User } from "./userModel";
import { Admin, Principal, Student, Teacher } from "./roleModels";
import { Subject } from "./subject";

export const models = {
  User: model("User", User),
  Student: model("Student", Student),
  Teacher: model("Teacher", Teacher),
  Admin: model("Admin", Admin),
  Subject: model("Subject", Subject),
  Principal: model("Principal", Principal),
};
