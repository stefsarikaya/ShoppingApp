
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { ArticleFeature } from "src/entities/article-feature.entity";
import { ArticlePrice } from "src/entities/article-price.entity";
import { Article } from "src/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";
import { EditArticleDto } from "src/dtos/article/edit.article.dto";

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

  async editFullArticle(articleId:number, data:EditArticleDto):Promise<Article|ApiResponse>{
      const existingArticle:Article= await this.article.findOne({ where: { articleId: articleId }, 
        relations: ['articlePrices', 'articleFeatures']});
      if (!existingArticle) 
        return new ApiResponse('error',-5001,'Article not found!');
        
        existingArticle.name=data.name;
        existingArticle.categoryId=data.categoryId;
        existingArticle.except=data.excerpt;
        existingArticle.description=data.description;
        existingArticle.status=data.status;
        existingArticle.isPromoted=data.isPromoted;

        const savedArticle = await this.article.save(existingArticle);
        if (!savedArticle) {
          return new ApiResponse('error',-5002,'Could not save new article data!');
        }

        const newPriceString:string=Number(data.price).toFixed(2); // 50.1 --> "50.10"
        const lastPrice=existingArticle.articlePrices[existingArticle.articlePrices.length-1].price;
        const lastPriceString:string=Number(lastPrice).toFixed(2);

        if (newPriceString!==lastPriceString) {
            const newArticlePrice= new ArticlePrice();
            newArticlePrice.articleId=articleId;
            newArticlePrice.price=data.price;

            const savedArticlePrice = await this.articlePrice.save(newArticlePrice);
            if (!savedArticlePrice) {
              return new ApiResponse('error',-5003,'Could not save the new article price!');
            }
        }
        
        if (data.features !== null) {
          await this.articleFeature.remove(existingArticle.articleFeatures);

          for (let feature of data.features){
            let newArticleFeature:ArticleFeature=new ArticleFeature();
            newArticleFeature.articleId=articleId;
            newArticleFeature.featureId=feature.featureId;
            newArticleFeature.value=feature.value;

            await this.articleFeature.save(newArticleFeature);
          }
        }
        return await this.article.findOne({where:
          {articleId: articleId},
              relations: {
                  category: true,
                  articleFeatures: true,
                  features: true,
                  articlePrices: true
          }}
        );
  }
}