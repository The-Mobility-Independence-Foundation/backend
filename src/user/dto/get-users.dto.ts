import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsPositive, Max, Min } from 'class-validator';
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
  @Min(0, { message: 'Minimum rating must be greater than 0.0' })
  @Max(5, { message: 'Minimum rating must be less than 5.0' })
  minRating?: number;

  @IsOptional()
  @ApiPropertyOptional()
  @Min(0, { message: 'Maximum rating must be greater than 0.0' })
  @Max(5, { message: 'Maximum rating must be less than 5.0' })
  maxRating?: number;

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
