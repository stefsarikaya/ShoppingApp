
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { ArticleFeature } from "src/entities/article-feature.entity";
import { ArticlePrice } from "src/entities/article-price.entity";
import { Article } from "src/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly article: Repository<Article>,

    @InjectRepository(ArticlePrice)
    private readonly articlePrice: Repository<ArticlePrice>,

    @InjectRepository(ArticleFeature)
    private readonly articleFeature: Repository<ArticleFeature>,
  ) {}
  async findAll(): Promise<Article[]> {
    return this.article
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.category", "category")
      .leftJoinAndSelect("article.photos", "photo")
      .leftJoinAndSelect("article.articlePrices", "articlePrice")
      .leftJoinAndSelect("article.articleFeatures", "articleFeature")
      .leftJoinAndSelect("articleFeature.feature", "feature")
      .getMany();
  }

  async findOneById(id: number): Promise<Article | null> {
    return this.article
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.category", "category")
      .leftJoinAndSelect("article.photos", "photo")
      .leftJoinAndSelect("article.articlePrices", "articlePrice")
      .leftJoinAndSelect("article.articleFeatures", "articleFeature")
      .leftJoinAndSelect("articleFeature.feature", "feature")
      .where("article.articleId = :id", { id })
      .getOne();
  }

  async createFullArticle(data:AddArticleDto): Promise<Article|ApiResponse>{
        let newArticle:Article=new Article();
        newArticle.name=data.name;
        newArticle.categoryId=data.categoryId;
        newArticle.except=data.excerpt;
        newArticle.description=data.description;

        let savedArticle= await this.article.save(newArticle);

        let newArticlePrice: ArticlePrice= new ArticlePrice();
        newArticlePrice.articleId=savedArticle.articleId;
        newArticlePrice.price=data.price;

        await this.articlePrice.save(newArticlePrice);


        for (let feature of data.features){
            let newArticleFeature:ArticleFeature=new ArticleFeature();
            newArticleFeature.articleId=savedArticle.articleId;
            newArticleFeature.featureId=feature.featureId;
            newArticleFeature.value=feature.value;

            await this.articleFeature.save(newArticleFeature);
        }

        return await this.article.findOne({where:
          {articleId: savedArticle.articleId},
              relations: {
                  category: true,
                  articleFeatures: true,
                  features: true,
                  articlePrices: true
          }}
          );
  }
}