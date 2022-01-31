import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

import { userInfoDto } from './userInfoDto';
import { resultDashboardDto } from './resultDashboardDto';

export class userDashboardDto {
  @IsNotEmpty()
  @IsBoolean()
  access: boolean;

  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  surname: string;

  @IsOptional()
  @IsString()
  gift1: string;

  @IsOptional()
  @IsString()
  gift2: string;

  @IsOptional()
  @IsString()
  gift3: string;

  @IsOptional()
  @IsString()
  gift4: string;

  @IsOptional()
  @IsString()
  gift5: string;

  @IsOptional()
  @IsString()
  gift6: string;

  @IsOptional()
  @IsString()
  gift7: string;

  @IsOptional()
  @IsString()
  gift8: string;

  @IsOptional()
  @IsString()
  gift9: string;

  @IsOptional()
  @IsString()
  gift10: string;

  @IsOptional()
  @IsNumber()
  ssid: number;

  yourUserForSecretSanta: userInfoDto;

  result: resultDashboardDto;
}
