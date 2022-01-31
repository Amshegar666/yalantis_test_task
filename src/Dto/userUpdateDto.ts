import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class userUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  surname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gift1: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gift2: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gift3: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gift4: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gift5: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gift6: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gift7: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gift8: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gift9: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  gift10: string;
}
