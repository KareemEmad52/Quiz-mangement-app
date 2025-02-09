import mongoose from "mongoose";

export interface IQuestion extends mongoose.Document {
  title: string;
  choices: string[];
  correctAnswer: string;
  quizId: string;
}

const schema = new mongoose.Schema<IQuestion>({
  title: {
    type: String,
    required: true
  },
  choices: {
    type: [String],
    required: true
  },
  correctAnswer: {
    type: String,
    required: true
  },
  quizId: {
    type: String,
    required: true
  }
})

export const questionModel = mongoose.model<IQuestion>("Question", schema)