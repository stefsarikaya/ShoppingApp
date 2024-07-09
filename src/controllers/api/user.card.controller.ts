import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AddArticleToCardDto } from "src/dtos/card/add.article.to.card.dto";
import { EditArticleInCardDto } from "src/dtos/card/edit.article.card.dto";
import { Card } from "src/entities/card.entity";
import { Order } from "src/entities/order.entity";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { ApiResponse } from "src/misc/api.response.class";
import { RoleCheckedGuard } from "src/misc/role.checker.guard";
import { CardService } from "src/services/card/card.service";
import { OrderMailer } from "src/services/order/order.mailer.service";
import { OrderService } from "src/services/order/order.service";

@Controller('api/user/card')
export class UserCardController{
    constructor(
        private cardService:CardService,
        private orderService:OrderService,
        private orderMailer:OrderMailer,
      ){}

      private async getActiveCardForUserId(userId:number): Promise<Card> {
        let card= await this.cardService.getLastActiveCardByUserId(userId);

        if (!card) {
            card=await this.cardService.createNewCardForUser(userId);
        }

        return await this.cardService.getById(card.cardId);
      }

      // http://localhost:3000/api/user/card
      @Get()
      @UseGuards(RoleCheckedGuard)
      @AllowToRoles('user','administrator')
      async getCurrentCard(@Req() req:Request): Promise<Card> {
        return await this.getActiveCardForUserId(req.token.id);
      }

      // http://localhost:3000/api/user/card/addToCard
      @Post('addToCard')
      @UseGuards(RoleCheckedGuard)
      @AllowToRoles('user', 'administrator')
      async addToCard(@Body() data:AddArticleToCardDto, @Req() req:Request):Promise<Card> {
          const card= await this.getActiveCardForUserId(req.token.id);
          return await this.cardService.addArticleToCard(card.cardId, data.articleId, data.quantity);
      }

      // http://localhost:3000/api/user/card/
      @Patch()
      @UseGuards(RoleCheckedGuard)
      @AllowToRoles('user', 'administrator')
      async changeQuantity(@Body() data:EditArticleInCardDto, @Req() req:Request):Promise<Card>{
          const card= await this.getActiveCardForUserId(req.token.id);
          return await this.cardService.changeQuantity(card.cardId, data.articleId, data.quantity);
      }

      // http://localhost:3000/api/user/card/makeOrder/
      @Post('makeOrder')
      @UseGuards(RoleCheckedGuard)
      @AllowToRoles('user', 'administrator')
      async makeOrder(@Req() req:Request):Promise<Order|ApiResponse>{
          const card= await this.getActiveCardForUserId(req.token.id);
          const order= await this.orderService.add(card.cardId);
          
          if (order instanceof ApiResponse){
              return order;
          }
          await this.orderMailer.sendOrderEmail(order);

          return order;
        }
        
    }