import {BaseRepository} from "./BaseRepository.repository";
import {IQuestion, questionModel} from "../../DB/models/question.model";

export class QuestionRepository extends BaseRepository<IQuestion> {
  constructor() {
    super(questionModel); // Pass the Mongoose model to the BaseRepository
  }

  async insertQuestions(questions: IQuestion[]) : Promise<IQuestion[]> {
    // Use Mongoose's `insertMany` to insert multiple documents
    return this.model.insertMany(questions);
  }
}