export interface IUser {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  profileImage?: any;
  phoneNumber?: number;
  gender: string;
  stateOfOrigin: string;
  role: "admin" | "teacher" | "student" | "principal" | "vice_principal";
  token?: string;
  address: string;
  parentNumber?: string;
}
