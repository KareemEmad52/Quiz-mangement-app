import { UserRepository } from "../../common/Respositories/user.repository";
import { User } from "types";
import { QuizResultService } from "../QuizResult/quizResult.service";
import { QuizResultRepository } from "../../common/Respositories/quizResult.repository";
import { AppError } from "../../middlewares/errorHandler";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async AllUsers() {
    const users = await this.userRepository.getAllUsers();
    return users;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.getUserById(id);
    return user;
  }

  async updateUser(id: string, body: Partial<User>) {
    const user = this.userRepository.getUserById(id);
    if (!user) throw new Error("User not found");
    const updatedUser = await this.userRepository.updateOne(id, body);
    return updatedUser;
  }

  async deleteUser(id: string, userId: string) {
    try {
      // Step 1: Ensure the user exists
      const user = await this.userRepository.getUserById(id);
      if (!user) {
        throw new Error("User not found");
      }
  
      const quizResultRepository = new QuizResultRepository();
      const deletedResults = await quizResultRepository.deleteQuizSubmissionByUser(userId);
      
      if (!deletedResults)  new AppError("Failed to delete quiz submissions", 400);
      
  
      const deletedUser = await this.userRepository.deleteOne(userId);
      
      if (!deletedUser) new AppError("Failed to delete user",400);
  
      return deletedUser;
    } catch (error) {
      console.error("Error in deleteUser:", error.message);
      throw new AppError(`Deletion failed: ${error.message}`,400);
    }
  }
  
}
