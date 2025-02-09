import mongoose from "mongoose";
import { StatusEnums } from "../../common/types/types";

export interface IQuiz extends mongoose.Document {
  title: string;
  description: string;
  duration: number;
  status: StatusEnums;
  deadline: Date;
  noOfQuests: number;
  startTime: Date;
  teacher: mongoose.ObjectId;
  questions: mongoose.ObjectId[];
}

export const quizSchema = new mongoose.Schema<IQuiz>({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(StatusEnums),
  },
  deadline: {
    type: Date,
    required: true,
    validate: {
      validator: function(value: Date) {
        return value >= new Date();
      },
      message: 'Deadline must be a future date',
    },
  },
  noOfQuests: {
    type: Number,
    required: true,
    default: 0,
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
}, { timestamps: true });

export const quizModel = mongoose.model<IQuiz>('Quiz', quizSchema);