import { addQuestionToQuizDto, createQuizDto, deleteQuestionDto, deleteQuizReturnType } from "../../common/types/types";

import { QuizRepository } from "../../common/Respositories/quiz.repository";
import { AppError } from "../../middlewares/errorHandler";
import { StatusCodes } from "http-status-codes/build/cjs";
import { UserRepository } from './../../common/Respositories/user.repository';
import { QuestionRepository } from "../../common/Respositories/question.repository";

export class QuizService {

    constructor(
        private quizRepository: QuizRepository,
        private userRepository: UserRepository,
        private questionRepository: QuestionRepository
    ) { }

    // teacher role only can create the quiz
    async createQuiz(createQuizDto: createQuizDto) {
        const quiz = await this.quizRepository.createQuiz(createQuizDto)
        return {quiz};
    }
    async getNumberOfQuestions(quizId : string) {
        return (await this.questionRepository.findMany({quizId})).length;
    }

    // all roles  can get the quiz
    async getAllQuizesOfSpecificTeacher(teacherId: string) {
        const user = await this.userRepository.findUserById(teacherId);        
        if(!user) throw new AppError("user not found" , StatusCodes.NOT_FOUND);
        const quiz = await this.quizRepository.findMany({ teacher: teacherId })
        return quiz;
    }

    // all roles  can get the quiz
    async getAllQuizes() {
        const user = await this.quizRepository.findMany({}, "questions");
        return user;
    }
    // all roles  can get the quiz
    async getSpecificQuiz(quizId: string) {
        const quiz = await this.quizRepository.findOne({ _id: quizId }, "questions");
        if (!quiz) throw new AppError("Quiz not found", StatusCodes.NOT_FOUND);
        return quiz;
    }

    

    // teacher role only can update the quiz
    async updateQuiz(quizId: string, authenticatedUserId: string, updatedData: Partial<createQuizDto>) {
        const quiz = await this.quizRepository.findOne({ _id: quizId });
        if (!quiz) throw new AppError("quiz not found", StatusCodes.NOT_FOUND);
        if (authenticatedUserId != quiz.teacher.toString()) throw new AppError("Teacher only can update the quiz", StatusCodes.FORBIDDEN)
        const updatedQuiz = await this.quizRepository.updateQuiz(quizId , updatedData)
        return updatedQuiz;
    }


    async deleteQuiz(quizId: string , authenticatedUserId: string) : Promise<deleteQuizReturnType> {
        const quiz = await this.quizRepository.findOne({ _id: quizId });
        if (!quiz) throw new AppError("quiz not found", StatusCodes.NOT_FOUND);
        if (authenticatedUserId != quiz.teacher.toString()) throw new AppError("Teacher only can delete the quiz", StatusCodes.FORBIDDEN)
        const deletedQuiz = await this.quizRepository.deleteQuiz(quizId)
        return {
            deleted: true
        };
    }

    async addQuestionToSpecificQuiz(quizId: string, authenticatedUserId: string, data: addQuestionToQuizDto) {
        const quiz = await this.quizRepository.findOne({ _id: quizId });
        if (!quiz) throw new AppError("quiz not found", StatusCodes.NOT_FOUND);
        if (authenticatedUserId != quiz.teacher.toString()) throw new AppError("Teacher only can update the quiz", StatusCodes.FORBIDDEN)
        const updatedQuiz = await this.quizRepository.addQuestionToSpecificQuiz(quizId, {...data , quizId});
        return updatedQuiz;
    }
   

    async deleteQuestion(quizId: string, authenticatedUserId: string, data: deleteQuestionDto) {
        const quiz = await this.quizRepository.findOne({ _id: quizId });
        if (!quiz) throw new AppError("quiz not found", StatusCodes.NOT_FOUND);
        if (authenticatedUserId != quiz.teacher.toString()) throw new AppError("Teacher only can update the quiz", StatusCodes.FORBIDDEN)
        const updatedQuiz = await this.quizRepository.deleteQuestionFromSpecificQuiz(quizId, data);        
        return updatedQuiz;
    }

}


