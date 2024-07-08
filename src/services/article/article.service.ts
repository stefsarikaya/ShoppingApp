
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { ArticleFeature } from "src/entities/article-feature.entity";
import { ArticlePrice } from "src/entities/article-price.entity";
import { Article } from "src/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { Any, Brackets, In, Repository } from "typeorm";
import { EditArticleDto } from "src/dtos/article/edit.article.dto";
import { ArticleSearchDto } from "src/dtos/article/article.search.dto";

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

  async findByFilter(filter: any): Promise<Article[]> {
    const queryBuilder = this.article
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.photos', 'photo')
      .leftJoinAndSelect('article.articlePrices', 'articlePrice')
      .leftJoinAndSelect('article.articleFeatures', 'articleFeature')
      .leftJoinAndSelect('articleFeature.feature', 'feature');
  
    if (filter.categoryId) {
      queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId: filter.categoryId });
    }
  
    return await queryBuilder.getMany();
  }

  async search(data: ArticleSearchDto): Promise<Article[]> {
    const builder= await this.article.createQueryBuilder("article");
    builder.innerJoinAndSelect("article.articlePrices",
            "ap",
            "ap.created_at=(SELECT MAX(ap.createdAt) FROM article_price AS ap WHERE ap.article_id=article.article_id)"
              );
    builder.leftJoin("article.articleFeatures","af");
    builder.where('article.categoryId=:id',{id:data.categoryId});
                                           
    if (data.keywords && data.keywords.length > 0) {
      builder.andWhere(
          new Brackets(qb => {
              qb.where('article.name LIKE :kw', { kw: '%' + data.keywords.trim() + '%' })
                .orWhere('article.except LIKE :kw', { kw: '%' + data.keywords.trim() + '%' })
                .orWhere('article.description LIKE :kw', { kw: '%' + data.keywords.trim() + '%' });
          })
      );
  }
  

    if (data.priceMin && typeof data.priceMin==='number'){
      builder.andWhere('ap.price >= :min', {min:data.priceMin});
    }
    if (data.priceMax && typeof data.priceMax==='number'){
      builder.andWhere('ap.price <= :max', {max:data.priceMax});
    }
    if (data.features && data.features.length>0){
      for (const feature of data.features){
          builder.andWhere('af.featureId = :fId AND af.value IN (:fVals)', 
            {
              fId:feature.featureId,
              fVals:feature.values,
            });
          }
      }

let orderBy = 'article.name'; // Podrazumevana vrednost
if (data.orderBy) {
    if (data.orderBy === 'price') {
        orderBy = 'ap.price'; // Sortiranje po ceni iz povezane tabele `articlePrices`
    } else {
        orderBy = `article.${data.orderBy}`; // Sortiranje po drugim validnim kolonama
    }
}

let orderDirection: 'ASC' | 'DESC' = 'ASC';
if (data.orderDirection) {
    orderDirection = data.orderDirection;
}
      
    builder.orderBy(orderBy,orderDirection);

    let page=0;
    let perPage:5|10|25|50|75=25;

    if (data.page && typeof data.page==='number') {
          page=data.page;
    }

    if (data.itemsPerPage && typeof data.itemsPerPage==='number') {
        perPage=data.itemsPerPage;
    }

    builder.skip(page*perPage);
    builder.take(perPage);
      
    let articleIds= (await builder.getMany()).map(article => article.articleId);

    return await this.article.find({
      where: {
        articleId: In(articleIds)
      },
      relations: [
        "category",
        "articleFeatures",
        "features",
        "articlePrices",
        "photos"
      ]
    });
  }  
}