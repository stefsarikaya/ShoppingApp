import { IsNotEmpty, IsNumber, IsPositive} from 'class-validator';

export class EditArticleInCardDto{
    articleId:number;

    @IsNotEmpty()
    @IsPositive()
    @IsNumber({
      allowInfinity:false,
      allowNaN:false,
      maxDecimalPlaces:0
    })
    quantity:number;
}