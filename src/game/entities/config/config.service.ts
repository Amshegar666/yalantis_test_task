import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigEntity } from './config.entity';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(ConfigEntity)
    private entityRepository: Repository<ConfigEntity>,
  ) {}

  async findAll(): Promise<ConfigEntity[]> {
    return await this.entityRepository.find();
  }

  async lookShuffleStatus(): Promise<ConfigEntity> {
    return await this.entityRepository.findOne(1);
  }

  async createConfigs(): Promise<ConfigEntity> {
    return await this.entityRepository.save({ shuffled: false });
  }

  updateConfigs() {
    this.entityRepository.update(1, { id: 1, shuffled: true });
  }
}
