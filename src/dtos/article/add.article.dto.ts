import { IsNotEmpty, IsString, Length, Matches, IsNumber, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { ArticleFeatureComponentDto } from './article.feature.component.dto';

export class AddArticleDto {
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

    @IsArray()
    @ValidateNested({
        always:true,
    })
    features:ArticleFeatureComponentDto[];
}