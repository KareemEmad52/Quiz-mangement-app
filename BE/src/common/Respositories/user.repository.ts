import { Document } from "mongoose";
import { AddUserDto } from "../types/types"; // Import DTO
import { userModel, IUser } from "../../DB/models/user.model";

export class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return userModel.findOne({ email }).exec();
  }

  async addUser(user: AddUserDto): Promise<Partial<IUser>> {
    const { gender, password, name, email, role } = user;
    const newUser = await userModel.create({
      gender,
      password,
      name,
      email,
      role,
    });
    return {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      gender: newUser.gender,
    };
  }

  async findUserById(id: string): Promise<Partial<IUser> | null> {
    const user = await userModel.findById(id).exec();
    if (!user) return null;
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
    };
  }

  async findUserByCredentials(
    email: string,
    password: string
  ): Promise<IUser | null> {
    return userModel.findOne({ email, password }).exec();
  }

  async getAllUsers(): Promise<Partial<IUser>[]> {
    const users = await userModel.find({}).exec();
    return users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
    }));
  }

  async getUserById(id: string): Promise<IUser | null> {
    return userModel.findById(id).exec();
  }


  async updateOne(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return userModel.findOneAndUpdate({ _id: id }, data, { new: true }).select('-password').exec();
  }

  async deleteOne(id:string): Promise<IUser | null> {
    return userModel.findByIdAndDelete({_id: id},{ new: true }).select('-password').exec();
  } 

}
