import {
  Controller,
  Res,
  Req,
  Get,
  Post,
  Render,
  Body,
  Param,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { ApiTags, ApiOkResponse, ApiProperty, ApiBody } from '@nestjs/swagger';
import { userUpdateDto } from '../../../Dto/userUpdateDto';
import { userDashboardDto } from '../../../Dto/userDashboardDto';
import { UsersService } from '../../entities/users/users.service';

@ApiTags('dashboard')
@Controller()
export class DashboardController {
  constructor(private usersService: UsersService) {}

  @ApiOkResponse({ description: 'User dashboard' })
  @ApiProperty()
  @Get('/dashboard/:id')
  @Render('cabinet/index')
  async dashboard(
    @Req() request,
    @Param('id') id: number,
  ): Promise<userDashboardDto | { access: boolean }> {
    if (request.session.uid != id) {
      return { access: false };
    } else {
      const user = await this.usersService.findOneById(id);
      let yourUserForSecretSanta = null;
      if (user.ssid !== null) {
        yourUserForSecretSanta = await this.usersService.findOneById(user.ssid);
      }
      const error = request.session.updateStatus
        ? request.session.updateStatus.error
        : null;
      const success = request.session.updateStatus
        ? request.session.updateStatus.success
        : null;
      const message = request.session.updateStatus
        ? request.session.updateStatus.message
        : null;

      request.session.updateStatus = {
        error: null,
        success: null,
        message: null,
      };

      return {
        access: true,
        id: user.id,
        login: user.login,
        name: user.name,
        surname: user.surname,
        gift1: user.gift1,
        gift2: user.gift2,
        gift3: user.gift3,
        gift4: user.gift4,
        gift5: user.gift5,
        gift6: user.gift6,
        gift7: user.gift7,
        gift8: user.gift8,
        gift9: user.gift9,
        gift10: user.gift10,
        ssid: user.ssid,
        yourUserForSecretSanta: yourUserForSecretSanta,
        result: {
          error: error,
          success: success,
          message: message,
        },
      };
    }
  }

  @ApiOkResponse({ description: 'Update user data' })
  @ApiProperty()
  @ApiBody({ type: [userUpdateDto] })
  @Post('/update/:id')
  async update(
    @Param('id') id: number,
    @Res() res,
    @Req() request,
    @Body()
    postData: {
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
      saveData: boolean;
    },
  ): Promise<any> {
    if (request.session.uid != id) {
      res.redirect('/');
    } else {
      const userDto = new userUpdateDto();
      userDto.name = postData.name;
      userDto.surname = postData.surname;
      userDto.gift1 = postData.gift1;
      userDto.gift2 = postData.gift2;
      userDto.gift3 = postData.gift3;
      userDto.gift4 = postData.gift4;
      userDto.gift5 = postData.gift5;
      userDto.gift6 = postData.gift6;
      userDto.gift7 = postData.gift7;
      userDto.gift8 = postData.gift8;
      userDto.gift9 = postData.gift9;
      userDto.gift10 = postData.gift10;
      validate(userDto)
        .then((errors) => {
          if (errors.length > 0) {
            for (const key in errors[0].constraints) {
              request.session.error = errors[0].constraints[key];
              break;
            }
            request.session.header = errors[0].property + ' error';
            request.session.link = '/dashboard/' + id;
            throw new Error();
          }
        })
        .then(async () => {
          const updateData = {
            id: Number(id),
            name: postData.name,
            surname: postData.surname,
            gift1: postData.gift1,
            gift2: postData.gift2,
            gift3: postData.gift3,
            gift4: postData.gift4,
            gift5: postData.gift5,
            gift6: postData.gift6,
            gift7: postData.gift7,
            gift8: postData.gift8,
            gift9: postData.gift9,
            gift10: postData.gift10,
          };
          const result = await this.usersService.update(updateData);
          if (result['affected']) {
            request.session.updateStatus = {
              error: false,
              success: true,
              message: 'successfull',
            };
          } else {
            request.session.updateStatus = {
              error: true,
              success: false,
              message: 'Updating was failed',
            };
          }
          res.redirect('/dashboard/' + id);
        })
        .catch(async () => {
          res.redirect('/failed');
        });
    }
  }
}
