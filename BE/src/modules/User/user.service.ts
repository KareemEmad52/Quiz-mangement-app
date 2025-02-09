import { UserRepository } from "../../common/Respositories/user.repository";



export class UserService{

    constructor(private userRepository: UserRepository){}

    async AllUsers(){
        const users = await this.userRepository.getAllUsers()
        return users;
    }

    async getUserById(id : string){
        const user = await this.userRepository.getUserById(id)
        return user;
    }

}