import { AppError } from '../../middlewares/errorHandler';
import { StatusCodes } from 'http-status-codes';
import { QuizRepository } from '../../common/Respositories/quiz.repository';
import { UserRepository } from '../../common/Respositories/user.repository';
import { QuestionRepository } from '../../common/Respositories/question.repository';
import { QuizResultRepository } from '../../common/Respositories/quizResult.repository';
import { AnswerDataType } from '../../common/types/types';


export class QuizResultService {
    constructor(
        private quizRepository: QuizRepository,
        private userRepository: UserRepository,
        private questionRepository: QuestionRepository,
        private quizResultRepository: QuizResultRepository,
    ) { }

    async submitQuiz(quizId: string, userId: string, answers: AnswerDataType[]) {

        // Check if the quiz exists
        const quiz = await this.quizRepository.findOne({ _id: quizId });
        if (!quiz) throw new AppError('Quiz not found', StatusCodes.NOT_FOUND);
    
        // Check if the user exists
        const user = await this.userRepository.findUserById(userId);
        if (!user) throw new AppError('User not found', StatusCodes.NOT_FOUND);
    
        // Fetch all questions for the quiz
        const questions = await this.questionRepository.findMany({ quizId: quiz._id });
        if (!questions || questions.length === 0) {
            throw new AppError('No questions found for this quiz', StatusCodes.NOT_FOUND);
        }
    
        // Calculate the score
        let score = 0;
        answers.forEach((answer) => {
            const question = questions.find((q) => q.id === answer.questionId);
            if (question && question.correctAnswer === answer.selected) {
                score += 1;
            }
        });
    
        // Create the quiz result
        return this.quizResultRepository.createQuizResult(quizId, userId, score, answers);
    }
    
      async getQuizResultsByUser(userId: string) {
        return this.quizResultRepository.getQuizResultsByUser(userId);
      }
    
      async getQuizResultsByQuiz(quizId: string , userId: string) {
        return this.quizResultRepository.getQuizResultsByQuiz(quizId , userId);
      }
    
      async getQuizResultById(quizResultId: string) {
        const quizResult = await this.quizResultRepository.getQuizResultById(quizResultId);
        if (!quizResult) throw new AppError('Quiz result not found', StatusCodes.NOT_FOUND);
        return quizResult;
      }
}

