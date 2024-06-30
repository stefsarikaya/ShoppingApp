import { IsNotEmpty, IsEmail, IsString, Length, IsPhoneNumber} from 'class-validator';

export class UserRegistrationDto{
    @IsNotEmpty()
    @IsEmail({
    allow_ip_domain:false,
    allow_utf8_local_part:true,
    require_tld:true
  })
    email:string;

    @IsNotEmpty()
    @IsString()
    @Length(6,128)
    password:string;

    @IsNotEmpty()
    @IsString()
    @Length(2,64)
    forename:string;

    @IsNotEmpty()
    @IsString()
    @Length(2,64)
    surname:string;

    @IsNotEmpty()
    @IsPhoneNumber(null)
    phoneNumber:string;

    @IsNotEmpty()
    @IsString()
    @Length(10,512)
    postalAddress:string;
}