import { model } from "mongoose";
import { UserSchema } from "./userModel";
import {
  AdminSchema,
  PrincipalSchema,
  StudentScema,
  TeacherSchema,
} from "./roleModels";

import { Subject } from "./subject";
import { EventSchema } from "./allSchemas";

export const models = {
  User: model("User", UserSchema),
  Student: model("Student", StudentScema),
  Teacher: model("Teacher", TeacherSchema),
  Admin: model("Admin", AdminSchema),
  Subject: model("Subject", Subject),
  Principal: model("Principal", PrincipalSchema),
  Event: model("Events", EventSchema),
};
