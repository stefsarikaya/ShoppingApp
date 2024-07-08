import { IsNotEmpty, IsString, Length, Matches, IsNumber, IsPositive, IsOptional, IsIn } from 'class-validator';
import { ArticleSearchFeatureComponentDto } from './article.search.feature.component';

export class ArticleSearchDto {
    @IsNotEmpty()
    @IsPositive()
    @IsNumber({
        allowInfinity:false,
        allowNaN:false,
        maxDecimalPlaces:0,
    })
    categoryId:number;

    @IsOptional()
    @IsString()
    @Length(2,128)
    keywords:string;
    
    @IsOptional()
    @IsNumber({
        allowInfinity:false,
        allowNaN:false,
        maxDecimalPlaces:2,
    })
    @IsPositive()
    priceMin:number;

    @IsOptional()
    @IsNumber({
        allowInfinity:false,
        allowNaN:false,
        maxDecimalPlaces:2,
    })
    @IsPositive()
    priceMax:number;


    features:ArticleSearchFeatureComponentDto[];

    @IsOptional()
    @IsIn(['name','price'])
    orderBy:'name'| 'price';

    @IsOptional()
    @IsIn(['ASC','DESC'])
    orderDirection:'ASC'|'DESC';

    @IsOptional()
    @IsNumber({
        allowInfinity:false,
        allowNaN:false,
        maxDecimalPlaces:0,
    })
    @IsPositive()
    page:number;
  
    @IsOptional()
    @IsIn([5,10,25,50,75])
    itemsPerPage:5|10|25|50|75;
}