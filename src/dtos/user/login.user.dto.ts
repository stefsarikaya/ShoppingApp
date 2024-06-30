import { IsNotEmpty, IsEmail, IsString, Length} from 'class-validator';


export class LoginUserDto{
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
}