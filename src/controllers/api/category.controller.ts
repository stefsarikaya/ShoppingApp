import { Controller, Get, Req } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Category } from 'src/entities/category.entity';
import { CategoryService } from 'src/services/category/category.service';

@Crud({
  model: {
    type: Category,
  },
  params: {
    id: {
      field: 'categoryId',
      type: 'number',
      primary: true,
    },
  },
  query: {
    join: {
      categories: {
        eager: false, // Eager loading is set to false by default, so you need to request it explicitly
      },
      parentCategory: {
        eager: false,
      },
      features:{
        eager: false,
      },
      articles:{
        eager: false,
      },
    },
  },
})
@Controller('api/category')
export class CategoryController {
  constructor(public service: CategoryService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.service.find({
      join: {
        alias: 'category',
        leftJoinAndSelect: {
          categories: 'category.categories',
          parentCategory: 'category.parentCategory',
          features: 'category.features',
          articles: 'category.articles',
        },
      },
    });
  }
}
