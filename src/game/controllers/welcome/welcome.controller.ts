import { Controller, Res, Req, Get, Post, Render, Body } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { validate } from 'class-validator';
import { userSignDto } from '../../../Dto/userSignDto';
import { UsersService } from '../../entities/users/users.service';
import { ConfigService } from '../../entities/config/config.service';

@ApiTags('welcome')
@Controller()
export class WelcomeController {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @ApiOkResponse({ description: 'Main page' })
  @Get('/')
  @Render('welcome/index')
  async index() {
    let shuffled = false;
    const config = await this.configService.lookShuffleStatus();
    if (!config) {
      this.configService.createConfigs();
    } else {
      shuffled = config.shuffled;
    }
    const users = await this.usersService.findAll();
    const placesCountAvailable = 500 - users.length;
    let regPermission = true;
    if (placesCountAvailable === 0) {
      regPermission = false;
    }
    return {
      count: placesCountAvailable,
      regPermission: regPermission,
      shuffled: shuffled,
    };
  }

  @ApiOkResponse({ description: 'Page with fail message' })
  @Get('/failed')
  @Render('welcome/failed')
  failed(@Req() request) {
    const error = request.session.error;
    request.session.error = null;
    const link = request.session.link;
    request.session.link = null;
    const header = request.session.header;
    request.session.header = null;
    return {
      message: error,
      link: link,
      header: header,
    };
  }

  @ApiOkResponse({ description: 'Logout' })
  @Get('/exit')
  exit(@Req() request, @Res() res) {
    request.session.uid = null;
    res.redirect('/');
  }

  @ApiOkResponse({ description: 'Sign in page' })
  @Get('/signin')
  @Render('welcome/signin')
  signin() {
    return;
  }

  @ApiOkResponse({ description: 'Sign in process' })
  @ApiBody({ type: [userSignDto] })
  @Post('/signin')
  async login(
    @Res() res,
    @Req() request,
    @Body() entityData: { login: string; password: string; signin: boolean },
  ): Promise<any> {
    const userDto = new userSignDto();
    userDto.login = entityData.login;
    userDto.password = entityData.password;
    validate(userDto)
      .then((errors) => {
        if (errors.length > 0) {
          for (const key in errors[0].constraints) {
            request.session.error = errors[0].constraints[key];
            break;
          }
          request.session.header = errors[0].property + ' error';
          request.session.link = '/signin';
          throw new Error();
        }
      })
      .then(async () => {
        const user = await this.usersService.findOneForSignIn(
          entityData.login,
          entityData.password,
        );
        return user;
      })
      .then(async (user) => {
        if (user) {
          request.session.uid = user.id;
          res.redirect('/dashboard/' + user.id);
        } else {
          request.session.error = 'Wrong creditnals';
          request.session.header = 'Error';
          request.session.link = '/signin';
          throw new Error();
        }
      })
      .catch(async () => {
        res.redirect('/failed');
      });
  }

  @ApiOkResponse({ description: 'Sign up page' })
  @Get('/signup')
  @Render('welcome/signup')
  signup() {
    return;
  }

  @ApiOkResponse({ description: 'Sign up process' })
  @ApiBody({ type: [userSignDto] })
  @Post('/signup')
  async create(
    @Res() res,
    @Req() request,
    @Body() entityData: { login: string; password: string; signin: boolean },
  ): Promise<any> {
    const users = await this.usersService.findAll();
    if (users.length === 500) {
      request.session.error = 'All places for participation are taken';
      request.session.header = 'Error';
      request.session.link = '/';
      res.redirect('/failed');
    } else {
      const userDto = new userSignDto();
      userDto.login = entityData.login;
      userDto.password = entityData.password;
      validate(userDto)
        .then((errors) => {
          if (errors.length > 0) {
            for (const key in errors[0].constraints) {
              request.session.error = errors[0].constraints[key];
              break;
            }
            request.session.header = errors[0].property + ' error';
            request.session.link = '/signup';
            throw new Error();
          }
        })
        .then(async () => {
          const userForCheck = await this.usersService.findOneForSignUp(
            entityData.login,
          );
          return userForCheck;
        })
        .then(async (user) => {
          if (!user) {
            const user = await this.usersService.create(userDto);
            request.session.uid = user.id;
            res.redirect('/dashboard/' + user.id);
          } else {
            request.session.error = 'This login already isset';
            request.session.header = 'Error';
            request.session.link = '/signup';
            throw new Error();
          }
        })
        .catch(async () => {
          res.redirect('/failed');
        });
    }
  }
}
