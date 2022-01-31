import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class shuffleStartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;
}
