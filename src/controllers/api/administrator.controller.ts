import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Administrator } from "src/entities/administrator.entity";
import { AddAdministratorDto } from "src/dtos/administrator/add.administrator.dto";
import { EditAdministratorDto } from "src/dtos/administrator/edit.administrator.dto";
import { ApiResponse } from "src/misc/api.response.class";

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
      getById( @Param('id') administratorId:number): Promise<Administrator| ApiResponse> {
        return new Promise(async(resolve) => {
          let admin= await this.administratorService.getById(administratorId);

      if (admin===null){
        resolve(new ApiResponse("error",-1002));
      }

      resolve(admin);
      });
  }

      //dodavanje novog admina

      // PUT http://localhost:3000/api/administrator
      @Put()
      add( @Body() data:AddAdministratorDto): Promise<Administrator | ApiResponse> {
          return this.administratorService.add(data);
      }

      // POST http://localhost:3000/api/administrator
      @Post(':id')
      edit(@Param('id') id:number, @Body() data: EditAdministratorDto): Promise<Administrator | ApiResponse>{
          return this.administratorService.editById(id,data);
      }
} 