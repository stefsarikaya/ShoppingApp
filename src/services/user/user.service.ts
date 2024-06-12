import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserRegistrationDto } from 'src/dtos/user/user.registration.dto';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { ApiResponse } from 'src/misc/api.response.class';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
  @InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {
    super(userRepository);
  }

  async register(data:UserRegistrationDto):Promise<User | ApiResponse>{
    const passwordHash=crypto.createHash('sha512');
    passwordHash.update(data.password);
    const passwordHashString=passwordHash.digest('hex').toUpperCase();

    const newUser:User=new User();
    newUser.email=data.email;
    newUser.passwordHash=passwordHashString;
    newUser.forename=data.forename;
    newUser.surname=data.surname;
    newUser.phoneNumber=data.phoneNumber;
    newUser.postalAddress=data.postalAddress;

    try {
        const savedUser= await this.userRepository.save(newUser);

        if (!savedUser) {
          throw new Error('');
        }
        return savedUser;
    } catch (error) {
      return new ApiResponse('error', -6001, 'This user account cannot be crated.')
    }
  }
  /*
  async getById(id){
    return await this.userRepository.findOne(id);
  }
  */
  getById(id:number): Promise<User>{
    return this.userRepository.findOne({ where: { userId: id }});
}

  async getByEmail(email:string): Promise<User | null>{
    const user= await this.userRepository.findOne({ where: { email: email }});

    if (user){
        return user;
    }

    return null;
}
}