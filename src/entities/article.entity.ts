import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category.entity";
import { ArticleFeature } from "./article-feature.entity";
import { ArticlePrice } from "./article-price.entity";
import { CardArticle } from "./card-article.entity";
import { Photo } from "./photo.entity";
import { Feature } from "./feature.entity";
import * as Validator from 'class-validator';

@Index("fk_article_category_id", ["categoryId"], {})
@Entity("article")
export class Article {
  @PrimaryGeneratedColumn({ type: "int", name: "article_id", unsigned: true })
  articleId: number;

  @Column({ type:"varchar",length: 120})
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5,120)
  name: string;

  @Column({ type:"int", name: "category_id", unsigned: true})
  categoryId: number;

  @Column({ type:"varchar",length: 255})
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(10,255)
  except: string;

  @Column({ type:"text"})
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(64, 10000)
  description: string;

  @Column({
    type:"enum",
    enum: ["available", "visible", "hidden"],
    default: () => "'available'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsIn(["available", "visible", "hidden"])
  status: "available" | "visible" | "hidden";

  @Column({
    type:"tinyint",
    name: "is_promoted",
    unsigned: true
  })
  @Validator.IsNotEmpty()
  @Validator.IsIn([0,1])
  isPromoted: number;

  @Column({ type:"timestamp", name: "created_at", default: () => "'now()'" })
  createdAt: Date;

  @ManyToOne(() => Category, (category) => category.articles, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @OneToMany(() => ArticleFeature, (articleFeature) => articleFeature.article)
  articleFeatures: ArticleFeature[];

  @ManyToMany(type=>Feature, feature => feature.articles)
  @JoinTable({
    name:"article_feature",
    joinColumn:{name:"article_id",referencedColumnName:"articleId"},
    inverseJoinColumn:{name:"feature_id", referencedColumnName:"featureId"}
  })
  features:Feature[];

  @OneToMany(() => ArticlePrice, (articlePrice) => articlePrice.article)
  articlePrices: ArticlePrice[];

  @OneToMany(() => CardArticle, (cardArticle) => cardArticle.article)
  cardArticles: CardArticle[];

  @OneToMany(() => Photo, (photo) => photo.article)
  photos: Photo[];
}
