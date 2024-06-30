import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Card } from "./card.entity";
import * as Validator from 'class-validator';

@Index("uk_order_card_id", ["cardId"], { unique: true })
@Entity("order")
export class Order {
  @PrimaryGeneratedColumn({ type: "int", name: "order_id", unsigned: true })
  orderId: number;

  @Column({ type:"timestamp", name: "created_at", default: () => "'now()'" })
  createdAt: Date;

  @Column({
    type:"int",
    name: "card_id",
    unique: true,
    unsigned: true
  })
  cardId: number;

  @Column({
    type:"enum",
    enum: ["rejected", "accepted", "shipped", "pending"],
    default: () => "'pending'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsIn(["rejected", "accepted", "shipped", "pending"])
  status: "rejected" | "accepted" | "shipped" | "pending";

  @OneToOne(() => Card, (card) => card.order, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "card_id", referencedColumnName: "cardId" }])
  card: Card;
}
