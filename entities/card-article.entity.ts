import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./article.entity";
import { Card } from "./card.entity";

@Index("card_article_id_article_id", ["articleId"], {})
@Index("uk_card_article_id_card_id_article_id", ["cardId", "articleId"], {
  unique: true,
})
@Entity("card_article")
export class CardArticle {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "card_article_id",
    unsigned: true,
  })
  cardArticleId: number;

  @Column({type:"int", name: "card_id", unsigned: true})
  cardId: number;

  @Column({type:"int", name: "article_id", unsigned: true})
  articleId: number;

  @Column({type:"int", unsigned: true})
  quantity: number;

  @ManyToOne(() => Article, (article) => article.cardArticles, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "articleId" }])
  article: Article;

  @ManyToOne(() => Card, (card) => card.cardArticles, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "card_id", referencedColumnName: "cardId" }])
  card: Card;
}
