import { Controller, Get, Param, Request, NotFoundException, Post, Body } from "@nestjs/common";
import { Crud, CrudController, Override} from "@nestjsx/crud";
import { Article } from "entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ArticleService } from "src/services/article/article.service";

@Controller('api/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

@Get()
async getArticles(): Promise<Article[]> {
  return this.articleService.findAll();
}

@Get(':id')
async getArticleById(@Param('id') id: number): Promise<Article> {
  const article = await this.articleService.findOneById(id);

  if (!article) {
    throw new NotFoundException(`Article with id ${id} not found`);
  }

  return article;
}
  @Post('createFull')     // http://localhost:3000/api/article/createFull
  createFullArticle(@Body() data:AddArticleDto){
      return this.articleService.createFullArticle(data);
  }


}