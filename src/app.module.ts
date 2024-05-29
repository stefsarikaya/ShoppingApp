import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigurataion } from 'config/DatabaseConfigurataion'; 
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { ArticleFeature } from 'entities/article-feature.entity';
import { ArticlePrice } from 'entities/article-price.entity';
import { Article } from 'entities/article.entity';
import { CardArticle } from 'entities/card-article.entity';
import { Card } from 'entities/card.entity';
import { Category } from 'entities/category.entity';
import { Feature } from 'entities/feature.entity';
import { Order } from 'entities/order.entity';
import { Photo } from 'entities/photo.entity';
import { User } from 'entities/user.entity';
import { AdministratorController } from './controllers/api/administrator.controller';
import { CategoryController } from './controllers/api/category.controller';
import { CategoryService } from './services/category/category.service';
import { ArticleService } from './services/article/article.service';
import { ArticleController } from './controllers/api/article.controller';
import { CategoryModule } from './modules/category/category.modul';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middlewares';
import { PhotoService } from './services/photo/photo.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host:DatabaseConfigurataion.hostname,
      port:3306,
      username:DatabaseConfigurataion.username,
      password:DatabaseConfigurataion.password,
      database:DatabaseConfigurataion.database,
      entities:[
        Administrator,
        ArticleFeature,
        ArticlePrice,
        Article,
        CardArticle,
        Card,
        Category,
        Feature,
        Order,
        Photo,
        User,
      ]
    }),
    CategoryModule,
    TypeOrmModule.forFeature([Administrator,
      ArticleFeature,
      ArticlePrice,
      Article,
      CardArticle,
      Card,
      Category,
      Feature,
      Order,
      Photo,
      User,])
  ],
  controllers: [AppController, AdministratorController,CategoryController, ArticleController, AuthController],
  providers: [AdministratorService,CategoryService, ArticleService, PhotoService],
  exports: [CategoryService, AdministratorService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(AuthMiddleware)
      .exclude('auth/*')
      .forRoutes('api/*');
  }
}
