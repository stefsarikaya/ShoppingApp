import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AddArticleToCardDto } from "src/dtos/card/add.article.to.card.dto";
import { EditArticleInCardDto } from "src/dtos/card/edit.article.card.dto";
import { Card } from "src/entities/card.entity";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckedGuard } from "src/misc/role.checker.guard";
import { CardService } from "src/services/card/card.service";

@Controller('api/user/card')
export class UserCardController{
    constructor(
        private cardService:CardService){}

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
      @AllowToRoles('user')
      async getCurrentCard(@Req() req:Request): Promise<Card> {
        return await this.getActiveCardForUserId(req.token.id);
      }

      // http://localhost:3000/api/user/card/addToCard
      @Post('addToCard')
      @UseGuards(RoleCheckedGuard)
      @AllowToRoles('user')
      async addToCard(@Body() data:AddArticleToCardDto, @Req() req:Request):Promise<Card> {
          const card= await this.getActiveCardForUserId(req.token.id);
          return await this.cardService.addArticleToCard(card.cardId, data.articleId, data.quantity);
      }

      // http://localhost:3000/api/user/card/
      @Patch()
      @UseGuards(RoleCheckedGuard)
      @AllowToRoles('user')
      async changeQuantity(@Body() data:EditArticleInCardDto, @Req() req:Request):Promise<Card>{
          const card= await this.getActiveCardForUserId(req.token.id);
          return await this.cardService.changeQuantity(card.cardId, data.articleId, data.quantity);
      }

    }