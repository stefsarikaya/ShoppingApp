import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigurataion } from 'config/DatabaseConfigurataion'; 
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host:DatabaseConfigurataion.hostname,
      port:3306,
      username:DatabaseConfigurataion.username,
      password:DatabaseConfigurataion.password,
      database:DatabaseConfigurataion.database,
      entities:[Administrator]
    }),
    TypeOrmModule.forFeature([Administrator])
  ],
  controllers: [AppController],
  providers: [AdministratorService],
})
export class AppModule {}
