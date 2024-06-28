import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigurataion } from 'config/DatabaseConfigurataion'; 
import { Administrator } from 'src/entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { ArticleFeature } from 'src/entities/article-feature.entity';
import { ArticlePrice } from 'src/entities/article-price.entity';
import { Article } from 'src/entities/article.entity';
import { CardArticle } from 'src/entities/card-article.entity';
import { Card } from 'src/entities/card.entity';
import { Category } from 'src/entities/category.entity';
import { Feature } from 'src/entities/feature.entity';
import { Order } from 'src/entities/order.entity';
import { Photo } from 'src/entities/photo.entity';
import { User } from 'src/entities/user.entity';
import { AdministratorController } from './controllers/api/administrator.controller';
import { CategoryController } from './controllers/api/category.controller';
import { CategoryService } from './services/category/category.service';
import { ArticleService } from './services/article/article.service';
import { ArticleController } from './controllers/api/article.controller';
import { CategoryModule } from './modules/category/category.modul';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middlewares';
import { PhotoService } from './services/photo/photo.service';
import { FeatureService } from './services/feature/feature.service';
import { FeatureController } from './controllers/api/feature.controller';
import { UserService } from './services/user/user.service';
import { RoleCheckedGuard } from './misc/role.checker.guard';
import { CardService } from './services/card/card.service';
import { UserCardController } from './controllers/api/user.card.controller';
import { OrderService } from './services/order/order.service';

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
  controllers: [AppController, AdministratorController,CategoryController, ArticleController, AuthController,
    FeatureController, UserCardController],
  providers: [AdministratorService,CategoryService, ArticleService, PhotoService, 
    FeatureService, UserService, CardService, OrderService],
  exports: [CategoryService, AdministratorService, UserService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
      .apply(AuthMiddleware)
      .exclude('auth/*')
      .forRoutes('api/*');
  }
}
