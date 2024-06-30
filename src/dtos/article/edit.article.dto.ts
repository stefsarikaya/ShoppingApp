import { IsNotEmpty, IsString, Length, Matches, IsNumber, IsPositive, IsArray, ValidateNested, IsOptional,IsIn} from 'class-validator';
import { ArticleFeatureComponentDto } from './article.feature.component.dto';

export class EditArticleDto {
    @IsNotEmpty()
    @IsString()
    @Length(5,128)
    name:string;

    categoryId:number;

    @IsNotEmpty()
    @IsString()
    @Length(10,255)
    excerpt:string;

    @IsNotEmpty()
    @IsString()
    @Length(64,10000)
    description:string;

    @IsNotEmpty()
    @IsNumber({
    allowInfinity:false,
    allowNaN:false,
    maxDecimalPlaces:2,
    })
    @IsPositive()
    price:number;

    @IsNotEmpty()
    @IsString()
    @IsIn(["available", "visible", "hidden"])
    status:'available'|'visible'|'hidden';

    @IsNotEmpty()
    @IsIn([0,1])
    isPromoted:0 | 1;

    @IsOptional()
    @IsArray()
    @ValidateNested({
        always:true,
    })
    features:ArticleFeatureComponentDto[] | null;
}