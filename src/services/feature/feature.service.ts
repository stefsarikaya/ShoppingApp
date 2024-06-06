import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Category } from 'src/entities/category.entity';
import { Feature } from 'src/entities/feature.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeatureService extends TypeOrmCrudService<Feature> {
  constructor(@InjectRepository(Feature) private readonly featureRepository: Repository<Feature>,
  @InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {
    super(featureRepository);
  }

  async findOneFeature(id: number): Promise<Feature> {
    const feature = await this.featureRepository.findOne({ where: { featureId: id }, relations: ['category'] });
    if (!feature) {
      throw new NotFoundException('Feature not found');
    }
    return feature;
  }

  async createFeature(featureData: { name: string; categoryId: number }): Promise<Feature> {
    const { name, categoryId } = featureData;
    const category = await this.categoryRepository.findOne({ where: { categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const feature = this.featureRepository.create({ name, category });
    return await this.featureRepository.save(feature);
  }


  async updateFeature(id: number, updateData: Partial<Feature>): Promise<Feature> {
    const feature = await this.findOneFeature(id);
    if (!feature) {
      throw new NotFoundException('Feature not found');
    }
    if (updateData.categoryId !== undefined) {
      const category = await this.categoryRepository.findOne({ where: { categoryId: updateData.categoryId } });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      feature.category = category;
    }
    if (updateData.name !== undefined) {
      feature.name = updateData.name;
    }
    return await this.featureRepository.save(feature);
  }
  
}