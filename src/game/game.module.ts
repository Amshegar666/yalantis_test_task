import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminpanelController } from './controllers/adminpanel/adminpanel.controller';
import { DashboardController } from './controllers/dashboard/dashboard.controller';
import { WelcomeController } from './controllers/welcome/welcome.controller';
import { UsersService } from './entities/users/users.service';
import { ConfigService } from './entities/config/config.service';
import { UsersEntity } from './entities/users/users.entity';
import { ConfigEntity } from './entities/config/config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, ConfigEntity])],
  providers: [UsersService, ConfigService],
  controllers: [AdminpanelController, DashboardController, WelcomeController],
})
export class GameModule {}
