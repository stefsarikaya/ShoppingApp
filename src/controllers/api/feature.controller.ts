import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Feature } from 'src/entities/feature.entity';
import { AllowToRoles } from 'src/misc/allow.to.roles.descriptor';
import { RoleCheckedGuard } from 'src/misc/role.checker.guard';
import { FeatureService } from 'src/services/feature/feature.service';

@Controller('api/feature')
export class FeatureController {
  constructor(public service: FeatureService) {}

  @Get()
  @UseGuards(RoleCheckedGuard)
  @AllowToRoles('administrator','user')
  findAll(@Req() req: any) {
    return this.service.find({
      join: {
        alias: 'feature',
        leftJoinAndSelect: {
          category: 'feature.category'
        },
      },
    });
  }

  @Get(':id')
  @UseGuards(RoleCheckedGuard)
  @AllowToRoles('administrator','user')
  async findOne(@Param('id') id: number) {
    return await this.service.findOneFeature(id);
  }

  @Post()
  @UseGuards(RoleCheckedGuard)
  @AllowToRoles('administrator')
  async create(@Body() featureData: { name: string; categoryId: number }) {
    return await this.service.createFeature(featureData);
  }

  @Patch(':id')
  @UseGuards(RoleCheckedGuard)
  @AllowToRoles('administrator')
  async update(@Param('id') id: number, @Body() updateData: Partial<Feature>) {
    return await this.service.updateFeature(id, updateData);
  }
}


