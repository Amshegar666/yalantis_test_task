import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class resultDashboardDto {
  @IsOptional()
  @IsBoolean()
  error: boolean;

  @IsOptional()
  @IsBoolean()
  success: boolean;

  @IsOptional()
  @IsString()
  message: string;
}
