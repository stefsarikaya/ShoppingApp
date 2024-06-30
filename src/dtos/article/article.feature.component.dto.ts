import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ArticleFeatureComponentDto{
    featureId:number;

    @IsNotEmpty()
    @IsString()
    @Length(6,128)
    value:string;
}