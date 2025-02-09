import mongoose from "mongoose";
import {UserGender, UserRole} from "../../common/types/types";

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  gender: UserGender
  role: UserRole
  QuizzesResult?: any
}


const schema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  password: {
    required: true,
    type: String
  },
  gender: {
    type: String,
    enum: UserGender,
    required: true,
    default: UserGender.MALE
  },
  role: {
    type: String,
    enum: UserRole,
    default: UserRole.USER
  },
  QuizzesResult: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "QuizSubmission"
  }
},{timestamps: true})

export const userModel =  mongoose.model<IUser>('User', schema)