import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { CardArticle } from "./card-article.entity";
import { Order } from "./order.entity";

@Index("fk_card_user_id", ["userId"], {})
@Entity("card")
export class Card {
  @PrimaryGeneratedColumn({ type: "int", name: "card_id", unsigned: true })
  cardId: number;

  @Column({type:"int", name: "user_id", unsigned: true, default: () => "'0'" })
  userId: number;

  @Column({type:"timestamp",name: "created_at", default: () => "'now()'" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.cards, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => CardArticle, (cardArticle) => cardArticle.card)
  cardArticles: CardArticle[];

  @OneToOne(() => Order, (order) => order.card)
  order: Order;
}
