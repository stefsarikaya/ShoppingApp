import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "src/entities/article.entity";
import { CardArticle } from "src/entities/card-article.entity";
import { Card } from "src/entities/card.entity";
import { Order } from "src/entities/order.entity";
import { Repository } from "typeorm";

@Injectable()
export class CardService {
    constructor(
        @InjectRepository(Card) private readonly card:Repository<Card>,
        @InjectRepository(CardArticle) private readonly cardArticle:Repository<CardArticle>,
        @InjectRepository(Article) private readonly article:Repository<Article>,
        @InjectRepository(Order) private readonly order:Repository<Order>,
    ){}

    async getLastActiveCardByUserId(userId:number):Promise<Card|null>{
        const cards=await this.card.find({
            where: {
                userId:userId
            },
            order:{
                createdAt:"DESC"
            },
            take:1, 
            relations:["order"],
        });

        if (! cards || cards.length===0)
            return null;

        const card=cards[0];

        if (card.order!==null)
            return null;

        return card;
    }

    async createNewCardForUser(userId:number):Promise<Card>{
        const newCard: Card= new Card();
        newCard.userId=userId;
        return await this.card.save(newCard);
    }

    async addArticleToCard(cardId:number, articleId:number, quantity:number):Promise<Card>{
        let record:CardArticle = await this.cardArticle.findOne({ 
            where: { cardId: cardId, articleId:articleId}});

            if (!record) {
                record= new CardArticle();
                record.cardId=cardId;
                record.articleId=articleId;
                record.quantity=quantity;
            } else {
                record.quantity+=quantity;
            }

            await this.cardArticle.save(record);
            return this.getById(cardId);
    }

    async getById(cardId:number): Promise<Card>{
        return await this.card.findOne({ 
            where: { cardId: cardId},
            relations: [ 
                "user",
                "cardArticles",
                "cardArticles.article",
                "cardArticles.article.category",
            ],
        });
    }

    async changeQuantity(cardId:number, articleId:number, newQunatity:number):Promise<Card>{
        let record:CardArticle = await this.cardArticle.findOne({ 
            where: { cardId: cardId, articleId:articleId}});
        
            if (record) {
                record.quantity=newQunatity;

                if (record.quantity===0) {
                   await this.cardArticle.delete(record.cardArticleId);
                 } else{
                    await this.cardArticle.save(record);
                 } 
                }

            return await this.getById(cardId);


    }

}