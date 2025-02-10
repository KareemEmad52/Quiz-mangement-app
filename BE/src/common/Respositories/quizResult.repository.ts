import { IQuizSubmission, QuizSubmissionModel } from '../../DB/models/quizSubmission.model';
import { AnswerDataType } from '../types/types';
import { BaseRepository } from './BaseRepository.repository';

export class QuizResultRepository extends BaseRepository<IQuizSubmission> {

  constructor() {
    super(QuizSubmissionModel);
  }

  async findUnique(where: Partial<{ quiz: string; student: string }>): Promise<any | null> {
    return QuizSubmissionModel.findOne(where).exec();
  }

  async createQuizResult(quizId: string, userId: string, score: number, answers: AnswerDataType[]) {
    const quizSubmission = new QuizSubmissionModel({
      student: userId,
      quiz: quizId,
      score,
      answers: answers.map(answer => ({
        question: answer.questionId,
        answer: answer.selected,
      })),
      status: 'graded',
    });

    return quizSubmission.save();
  }

  async getQuizResultsByUser(userId: string) {
    return QuizSubmissionModel.find({ student: userId })
      .populate({
        path: 'quiz',
        populate: {
          path: 'questions',
          model: 'Question',
        },
      })
      .exec();
  }

  async getQuizResultsByQuiz(quizId: string ,userId: string) {
    return QuizSubmissionModel.find({ quiz: quizId , student: userId })
      .populate({
        path: 'quiz',
        select: "title  duration noOfQuests description status ",
      }).populate({
        path: 'answers.question',
        select: 'title choices correctAnswer -_id',
    })
      .exec();
  }

  async getQuizResultById(quizResultId: string) {
    return QuizSubmissionModel.findById(quizResultId)
      .populate('quiz')
      .populate('student')
      .exec();
  }

  async deleteQuizSubmissionByUser(studentId: string) {
    return QuizSubmissionModel.deleteMany({ student: studentId}).exec();
  }

}