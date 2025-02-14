import { addQuestionToQuizDto, createQuizDto, deleteQuestionDto, deleteQuizReturnType, QuizWithQuestionsDto } from "../types/types";
import { BaseRepository } from "./BaseRepository.repository";
import { IQuiz, quizModel } from "../../DB/models/quiz.model";
import { IQuestion, questionModel } from "../../DB/models/question.model";
import { Model, ObjectId } from "mongoose";
import {QuizSubmissionModel} from "../../DB/models/quizSubmission.model";
import { StatusCodes } from "http-status-codes/build/cjs";
import { AppError } from "../../middlewares/errorHandler";

export class QuizRepository extends BaseRepository<IQuiz> {
  constructor() {
    super(quizModel);
  }

  async createQuiz(data: createQuizDto): Promise<QuizWithQuestionsDto> {
    // Start a new session for the transaction
    const session = await quizModel.startSession();
    session.startTransaction();

    try {
      // Step 1: Create the quiz within the transaction
      const [quiz] = await this.model.create(
        [
          {
            description: data.description,
            title: data.title,
            duration: data.duration,
            startingTime: data.startingTime,
            status: data.status,
            deadline: data.deadline,
            teacher: data.teacher,
            noOfQuests: data.questions.length,
            questions: [],
          },
        ],
        { session } // Pass the session to ensure it's part of the transaction
      );

      // Step 2: Prepare questions with the quiz ID
      const questionsWithQuizId = data.questions.map((question) => ({
        ...question,
        quizId: quiz._id, // Associate questions with the quiz
      }));

      // Step 3: Insert the questions into the Question collection within the same transaction
      const questions = await questionModel.insertMany(questionsWithQuizId, {
        session,
      });

      // step 4: Update the quiz with the questions
      quiz.questions = questions.map((question) => question._id) as ObjectId[];
      await quiz.save({ session });

      // Step 5: Commit the transaction if everything succeeds
      await session.commitTransaction();

      // Return the quiz with its questions
      return {
        ...quiz.toObject(),
        questions,
      };
    } catch (error) {
      // Step 5: Abort the transaction if there's an error
      await session.abortTransaction();
      console.error("Error creating quiz:", error); // Log the error for debugging
      throw error; // Re-throw the error to notify the caller
    } finally {
      // End the session
      await session.endSession();
    }
  }

  async updateQuiz(
    quizId: string,
    data: Partial<createQuizDto>
  ): Promise<QuizWithQuestionsDto | null> {
    // Start a new session for the transaction
    const session = await this.model.startSession();
    session.startTransaction();

    try {
      // Step 1: Fetch the existing quiz with its questions
      const quiz = await this.model
        .findById(quizId)
        .populate("questions")
        .session(session);

      if (!quiz) {
        await session.abortTransaction();
        throw new Error("Quiz not found");
      }

      // Step 2: Update quiz fields (excluding questions for now)
      if (data.title) quiz.title = data.title;
      if (data.description) quiz.description = data.description;
      if (data.duration) quiz.duration = Number(data.duration);
      if (data.startingTime) quiz.startTime = data.startingTime;
      if (data.status) quiz.status = data.status;
      if (data.deadline) quiz.deadline = new Date(data.deadline);

      // Step 3: If questions are being updated, modify existing ones
      if (data.questions && data.questions.length > 0) {
        for (const q of data.questions) {
          const questionDocs = await questionModel
            .find({
              _id: { $in: quiz.questions }, // Get only questions related to this quiz
            })
            .session(session);
          const existingQuestion = questionDocs.find(
            (qItem) => qItem._id.toString() === q._id
          );

          if (existingQuestion) {
            // Update existing question
            Object.assign(existingQuestion, q);
            await existingQuestion.save({ session });
          } else {
            throw new Error(`Question with ID ${q._id} not found in this quiz`);
          }
        }
      }

      // Save the updated quiz
      await quiz.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      // Step 4: Fetch the updated quiz with its questions
      const updatedQuiz = await this.model
        .findById(quizId)
        .populate("questions");

      if (!updatedQuiz) {
        throw new Error("Updated quiz not found");
      }

      const QuizQuestion = await questionModel
        .find({
          _id: { $in: quiz.questions }, // Get only questions related to this quiz
        })
        .session(session);

      // Return the updated quiz
      return {
        ...updatedQuiz.toObject(),
        questions: QuizQuestion,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error("Error updating quiz:", error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async deleteQuiz(quizId: string): Promise<deleteQuizReturnType> {
    const session = await this.model.startSession();
    session.startTransaction();
    try {
      const quiz = await this.model.findById(quizId).session(session);
      if (!quiz) {
        await session.abortTransaction();
        throw new Error("Quiz not found");
      }
      await this.model.deleteOne({ _id: quizId },{new: true}).session(session);
      await questionModel.deleteMany({ quizId: quizId }).session(session);
      await QuizSubmissionModel.deleteMany({ quiz: quizId }).session(session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error("Error deleting quiz:", error);
    } finally {
      await session.endSession();
    }
    return {
      deleted: true,
    };
  }


  async addQuestionToSpecificQuiz(quizId: string, data: addQuestionToQuizDto) {
    const questions = await questionModel.insertMany(data);
    if(!questions) throw new AppError("Questions not found", StatusCodes.NOT_FOUND);
    const quiz = await this.model.findById(quizId);
    quiz.questions.push(...questions.map((q)=> q._id) as ObjectId[]);
    await quiz.save();
    return quiz
  }


  async deleteQuestionFromSpecificQuiz(quizId: string, data: deleteQuestionDto) {
    const quiz = await this.model.findById(quizId);
    if(!quiz) throw new AppError("quiz not found", StatusCodes.NOT_FOUND);
    const question = await questionModel.findByIdAndDelete(data.questionId);
    if(!question) throw new AppError("Question not found", StatusCodes.NOT_FOUND);
    const index = quiz.questions.indexOf(question._id as ObjectId);
    if(index === -1) throw new AppError("Question not found", StatusCodes.NOT_FOUND);
    quiz.questions.splice(index, 1);
    await quiz.save();
    return quiz
  }


}
