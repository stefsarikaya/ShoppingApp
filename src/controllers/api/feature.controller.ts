import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Req } from '@nestjs/common';
import { Feature } from 'src/entities/feature.entity';
import { FeatureService } from 'src/services/feature/feature.service';

@Controller('api/feature')
export class FeatureController {
  constructor(public service: FeatureService) {}

  @Get()
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
  async findOne(@Param('id') id: number) {
    return await this.service.findOneFeature(id);
  }

  @Post()
  async create(@Body() featureData: { name: string; categoryId: number }) {
    return await this.service.createFeature(featureData);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateData: Partial<Feature>) {
    return await this.service.updateFeature(id, updateData);
  }
}


