import { Controller, Res, Req, Get, Post, Render, Body } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from '../../entities/users/users.service';
import { ConfigService } from '../../entities/config/config.service';
import { shuffleStartDto } from '../../../Dto/shuffleStartDto';

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
    const config = await this.configService.lookShuffleStatus();
    const users = await this.usersService.findAll();
    return {
      count: users.length,
      shuffled: config.shuffled,
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
    @Body() entityData: shuffleStartDto,
  ): Promise<any> {
    const config = await this.configService.lookShuffleStatus();
    if (config.shuffled) {
      request.session.error = 'Users already shuffled';
      request.session.header = 'Error';
      request.session.link = '/adminpanel';
      res.redirect('/failed');
    } else {
      const users = await this.usersService.findAll();
      if (
        entityData.code == 'secretCode' &&
        users.length >= 3 &&
        users.length <= 500
      ) {
        this.usersService.shiffle();
        this.configService.updateConfigs();
        res.redirect('/adminpanel');
      } else if (entityData.code != 'secretCode') {
        request.session.error = 'Wrong secret code';
        request.session.header = 'Error';
        request.session.link = '/adminpanel';
        res.redirect('/failed');
      } else if (users.length < 3) {
        request.session.error = 'Users count lower then 3';
        request.session.header = 'Error';
        request.session.link = '/adminpanel';
        res.redirect('/failed');
      } else if (users.length > 500) {
        request.session.error = 'Users count upper then 500';
        request.session.header = 'Error';
        request.session.link = '/adminpanel';
        res.redirect('/failed');
      }
    }
  }
}
