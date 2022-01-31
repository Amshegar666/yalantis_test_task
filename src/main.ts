import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import { join } from 'path';
import { AppModule } from './app.module';

async function init() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const MAX = process.env.MAX_USER_LIMIT_FOR_SHUFFLE || 500;
  const MIN = process.env.MIN_USER_LIMIT_FOR_SHUFFLE || 3;
  const SECRET = process.env.SECRET_CODE_FOR_SHUFFLE || 'shuffle_word';
  const SESSION_SECRET = process.env.SESSION_SECRET || 'session_word';

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', 'assets'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const config = new DocumentBuilder()
    .setTitle('Secret Santa application')
    .setDescription(
      'Secret Santa app. Allows you to collect a database of users and mix them randomly, assigning each a secret santa. The maximum number of users to mix is ' +
        MAX +
        '. The minimum number of users to mix is ' +
        MIN +
        '. Secret code for shuffle - "' +
        SECRET +
        '".',
    )
    .setVersion('1.0')
    .addTag('Secret Santa For Yalantis')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3001;

  await app.listen(PORT);
}
init();
