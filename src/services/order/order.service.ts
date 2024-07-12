import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ChangeOrderStatusDto } from "src/dtos/order/change.order.status.dto";
import { Card } from "src/entities/card.entity";
import { Order } from "src/entities/order.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";


@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Card) private readonly card:Repository<Card>,
        @InjectRepository(Order) private readonly order:Repository<Order>
    ){}

    async add(cardId:number):Promise<Order|ApiResponse>{
        const order= await this.order.findOne({ 
            where: { cardId: cardId}});

            if(order){
                return new ApiResponse("error",-7001,"An order for this card has already been made!");
            }

            const card= await this.card.findOne({ 
                where: { cardId: cardId},
                relations:[ 
                    "cardArticles"
                ]});
            
            if(!card){
                return new ApiResponse("error",-7002,"No such card found!");
            }
            
            if (card.cardArticles.length===0){
                return new ApiResponse("error",-7003,"This card is empty!");
            }

            const newOrder:Order= new Order();
            newOrder.cardId = cardId;
            const savedOrder = await this.order.save(newOrder);

            return await this.getById(savedOrder.orderId);
    }

    async getById(orderId:number){
        return await this.order.findOne({ where:{orderId: orderId },
            relations:[ 
                "card",
                "card.user",
                "card.cardArticles",
                "card.cardArticles.article",
                "card.cardArticles.article.category",
                "card.cardArticles.article.articlePrices"
            ]});
    }

    async changeStatus(orderId:number, newStatus:"rejected" | "accepted" | "shipped" | "pending"){
        const order= await this.getById(orderId);

        if (!order) {
            return new ApiResponse("error",-9001,"No such order found!");
        }

        order.status=newStatus;
        await this.order.save(order);
        return await this.getById(orderId);

    }

}