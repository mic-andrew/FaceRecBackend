import { model } from "mongoose";
import { User } from "./userModel";
import { Admin, Student, Teacher } from "./roleModels";
import { Subject } from "./subject";



export const models = {
  User: model("User", User),
  Student: model("Student", Student),
  Teacher: model("Teacher", Teacher),
  Admin: model("Topic", Admin),
  Subject: model("Subject", Subject),
};