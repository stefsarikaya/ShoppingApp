import { IsNotEmpty, IsString, Length} from 'class-validator';

export class EditAdministratorDto{
    @IsNotEmpty()
    @IsString()
    @Length(6,128)
    password:string;
}