import { AppError } from "../../middlewares/errorHandler";
import {AddUserDto, LoginDto, User} from "../../common/types/types";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../common/Respositories/user.repository";

export class UserService {
  constructor(private userRepository: UserRepository) { }

  async register(user: AddUserDto): Promise<Partial<User>> {
    const userExist = await this.userRepository.findByEmail(user.email);

    if (userExist) throw new AppError("Email already exist", StatusCodes.CONFLICT);

    const hashedPassword: string = await bcrypt.hash(user.password, +process.env.HASS_SALTS)
    user.password = hashedPassword;

    return this.userRepository.addUser(user);
  }

  async login(user: LoginDto) {
    const userExist = await this.userRepository.findByEmail(user.email);

    if (!userExist)
      throw new AppError("Invalid Credentials", StatusCodes.NOT_FOUND);

    // const isMatch = await bcrypt.compare(user.password, userExist.password);

   const isMatch : Boolean = await bcrypt.compare( user.password , userExist.password)
    if (!isMatch)
      throw new AppError("Invalid Credentials", StatusCodes.NOT_FOUND);

    const { id, name, email, gender ,role } = userExist;

    const token = jwt.sign(
      { id, name, email, gender ,role },
      process.env.TOKEN_SECRET_KEY!
    );

    return { token, user: { id, name, email, gender ,role } };
  }



}
