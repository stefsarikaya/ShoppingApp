import { IsArray, IsNotEmpty, IsString, Length} from 'class-validator';

export class ArticleSearchFeatureComponentDto{
    featureId:number;

    @IsArray()
    @IsNotEmpty({each:true})
    @IsString({each:true})
    @Length(1,255, {each:true} )
    values:string[];
}