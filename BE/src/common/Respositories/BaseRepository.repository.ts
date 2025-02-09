import { Document, Model, FilterQuery, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository.interface";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const document = new this.model(data);
    return document.save();
  }

  async findOne(where: FilterQuery<T>, include?: string | string[]): Promise<T | null> {
    return this.model.findOne(where).populate(include).exec();
  }

  async findMany(where?: FilterQuery<T>, include?: string): Promise<T[]> {
    return this.model.find(where).populate(include).exec();
  }

  async update(where: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(where, data, { new: true }).exec();
  }

  async delete(where: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(where).exec();
  }
}