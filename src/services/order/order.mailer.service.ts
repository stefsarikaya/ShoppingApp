import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { MailConfig } from "config/mail.config";
import { CardArticle } from "src/entities/card-article.entity";
import { Order } from "src/entities/order.entity";


@Injectable()
export class OrderMailer {
    constructor(private readonly mailService:MailerService){}

    async sendOrderEmail(order:Order){
        await this.mailService.sendMail({
            to:order.card.user.email,
            bcc:MailConfig.orderNotificationMail,
            subject:'Order details',
            encoding:'UTF-8',
            html:this.makeOrderHtml(order),
        })
    }

    private makeOrderHtml(order:Order):string{
        let suma=order.card.cardArticles.reduce((sum, current:CardArticle)=>{
            return sum+current.quantity*current.article.articlePrices[current.article.articlePrices.length-1].price
        },0);

        return `<p>Poštovani/a,</p>
                <p>Zahvaljujemo se za Vašu porudžbinu!</p>
                <p>Ovo su detalji Vaše porudžbine:</p>
                <ul>
                    ${order.card.cardArticles.map((cardArticle:CardArticle)=>{
                        return `<li>
                            ${cardArticle.article.name} x
                            ${cardArticle.quantity}
                        </li>`
                    }).join("")}
                </ul>
                <p>Vaša porudžbina je u procesu pakovanja i biće poslata u najkraćem mogućem roku.</p>
                <p>Ukupan iznos za plaćanje iznosi: <b>${suma.toFixed(2)} €</b></p>
                <p>Ukoliko imate bilo kakvih pitanja ili nedoumica, slobodno nas kontaktirajte putem emaila.</p>
                <br>
                <p><b>Srdačan pozdrav,</b></p>
                <p><b>Stefan Đorđević</b></p>
                <p><b>Customer Support Manager</b></p>
                <p><b>AMG Technik GmbH Srbija</b></p>
                `
    }

}