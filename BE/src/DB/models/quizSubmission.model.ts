import mongoose from "mongoose";

export interface IQuizSubmission extends mongoose.Document {
  student: mongoose.Types.ObjectId;
  quiz: mongoose.Types.ObjectId;
  answers: { question: mongoose.Types.ObjectId; answer: string }[];
  score: number;
  submittedAt: Date;
  status: string;
}

const answerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const quizSubmissionSchema = new mongoose.Schema<IQuizSubmission>(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [answerSchema],
    score: {
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "submitted", "graded"],
      default: "submitted",
    },
  },
);


export const QuizSubmissionModel = mongoose.model("QuizSubmission", quizSubmissionSchema);
