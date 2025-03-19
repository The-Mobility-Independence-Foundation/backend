import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsPositive } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class GetUsersDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsPositive()
  nextToken?: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsPositive()
  count?: number;

  @IsOptional()
  @ApiPropertyOptional()
  username?: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: UserRole })
  accountType?: UserRole;

  @IsOptional()
  @ApiPropertyOptional()
  @IsBoolean({ message: '$value is not a boolean value' })
  isActive?: boolean;
}
