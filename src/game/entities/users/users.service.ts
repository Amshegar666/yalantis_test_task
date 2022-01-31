import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UsersEntity } from './users.entity';
import { userSignDto } from '../../../Dto/userSignDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private entityRepository: Repository<UsersEntity>,
  ) {}

  async findAll(): Promise<UsersEntity[]> {
    return await this.entityRepository.find();
  }

  async findOneById(id): Promise<UsersEntity> {
    return await this.entityRepository.findOne({ id: id });
  }

  async findOneForSignIn(login, password): Promise<UsersEntity> {
    return await this.entityRepository.findOne({
      login: login,
      password: password,
    });
  }

  async findOneForSignUp(login): Promise<UsersEntity> {
    return await this.entityRepository.findOne({
      login: login,
    });
  }

  async shiffle(): Promise<boolean> {
    const users = await this.entityRepository.find();
    let users2 = [...users];

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    users.forEach((user) => {
      const count = users2.length;
      let needToPush = false;
      users2 = users2.filter(function (el) {
        return el.id !== user.id;
      });
      if (count !== users2.length) {
        needToPush = true;
      }
      const idForSantaSet: number = getRandomInt(users2.length - 1);
      const entity = {
        id: users2[idForSantaSet].id,
        ssid: user.id,
      };
      users2.splice(idForSantaSet, 1);
      if (needToPush) {
        users2.push(user);
      }
      this.entityRepository.save(entity);
    });
    return true;
  }

  async create(entity: userSignDto): Promise<UsersEntity> {
    return await this.entityRepository.save(entity);
  }

  async update(entity: {
    id: number;
    name: string;
    surname: string;
    gift1: string;
    gift2: string;
    gift3: string;
    gift4: string;
    gift5: string;
    gift6: string;
    gift7: string;
    gift8: string;
    gift9: string;
    gift10: string;
  }): Promise<UpdateResult> {
    return await this.entityRepository.update(entity.id, entity);
  }
}
