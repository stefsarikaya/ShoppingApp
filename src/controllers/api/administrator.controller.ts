import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Administrator } from "entities/administrator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";

import { AdministratorService } from "src/services/administrator/administrator.service";

@Controller('api/administrator')
export class AdministratorController{
    constructor(
        private administratorService:AdministratorService
      ){}

      // http://localhost:3000/api/administrator
      @Get()
      getAll(): Promise<Administrator[]> {
        return this.administratorService.getAll();
      }

      // http://localhost:3000/api/administrator/1
      @Get(':id')
      getById( @Param('id') administratorId:number): Promise<Administrator> {
        return this.administratorService.getById(administratorId);
      }

      //dodavanje novog admina

      // PUT http://localhost:3000/api/administrator
      @Put()
      add( @Body() data:AddAdministratorDto): Promise<Administrator> {
          return this.administratorService.add(data);
      }

      // POST http://localhost:3000/api/administrator
      @Post(':id')
      edit(@Param('id') id:number, @Body() data: EditAdministratorDto): Promise<Administrator>{
          return this.administratorService.editById(id,data);
      }
} 