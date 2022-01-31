import { Controller, Res, Req, Get, Post, Render, Body } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { validate } from 'class-validator';
import { UsersService } from '../../entities/users/users.service';
import { ConfigService } from '../../entities/config/config.service';
import { shuffleStartDto } from '../../../Dto/shuffleStartDto';
import { MAX, MIN, SECRET } from '../../../config';

@ApiTags('adminpanel')
@Controller()
export class AdminpanelController {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @ApiOkResponse({ description: 'Retrieved all users' })
  @Get('/lookAll')
  async lookAll() {
    return await this.usersService.findAll();
  }

  @ApiOkResponse({ description: 'Retrieved all actual configs' })
  @Get('/lookConfig')
  async lookConfig() {
    return await this.configService.findAll();
  }

  @ApiOkResponse({ description: 'Retrieved shuffle dashboard' })
  @Get('/adminpanel')
  @Render('adminpanel/index')
  async adminpanel() {
    const users = await this.usersService.findAll();
    let shaffled = false;
    if (users.length > 0) {
      const config = await this.configService.lookShuffleStatus();
      shaffled = config.shuffled;
    }
    return {
      count: users.length,
      shuffled: shaffled,
    };
  }

  @ApiOkResponse({
    description: 'Start shuffle users, need special code for start',
  })
  @ApiBody({ type: [shuffleStartDto] })
  @Post('/shuffle')
  async shuffle(
    @Req() request,
    @Res() res,
    @Body()
    entityData: {
      code: string;
    },
  ): Promise<any> {
    const entityDataForValidate = new shuffleStartDto();
    entityDataForValidate.code = entityData.code;
    validate(entityDataForValidate)
      .then((errors) => {
        if (errors.length > 0) {
          for (const key in errors[0].constraints) {
            request.session.error = errors[0].constraints[key];
            break;
          }
          request.session.header = errors[0].property + ' error';
          request.session.link = '/adminpanel';
          throw new Error();
        }
      })
      .then(async () => {
        const config = await this.configService.lookShuffleStatus();
        if (config.shuffled) {
          request.session.error = 'Users already shuffled';
          request.session.header = 'Error';
          request.session.link = '/adminpanel';
          res.redirect('/failed');
        } else {
          const users = await this.usersService.findAll();
          if (
            entityData.code == SECRET &&
            users.length >= MIN &&
            users.length <= MAX
          ) {
            this.usersService.shiffle();
            this.configService.updateConfigs();
            res.redirect('/adminpanel');
          } else if (entityData.code != SECRET) {
            request.session.error = 'Wrong secret code';
            request.session.header = 'Error';
            request.session.link = '/adminpanel';
            res.redirect('/failed');
          } else if (users.length < MIN) {
            request.session.error = 'Users count lower then 3';
            request.session.header = 'Error';
            request.session.link = '/adminpanel';
            res.redirect('/failed');
          } else if (users.length > MAX) {
            request.session.error = 'Users count upper then 500';
            request.session.header = 'Error';
            request.session.link = '/adminpanel';
            res.redirect('/failed');
          }
        }
      })
      .catch(async () => {
        res.redirect('/failed');
      });
  }
}
