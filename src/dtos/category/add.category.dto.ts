import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class AddCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imagePath?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  parentCategoryId?: number;
}