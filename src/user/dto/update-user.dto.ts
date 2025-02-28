import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsNotEmpty({ message: 'First name cannot be blank.' })
  @MaxLength(20, {
    message:
      'First name is too long. Maximum length is $constraint1 characters.',
  })
  firstName?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNotEmpty({ message: 'Last name cannot be blank.' })
  @MaxLength(20, {
    message:
      'Last name is too long. Maximum length is $constraint1 characters.',
  })
  lastName?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNotEmpty({ message: 'Display name cannot be blank.' })
  @MaxLength(20, {
    message:
      'Display name is too long. Maximum length is $constraint1 characters.',
  })
  displayName?: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: UserRole })
  accountType?: UserRole;

  @IsOptional()
  @ApiPropertyOptional()
  @Min(0, { message: 'Rating must be greater than 0.0' })
  @Max(5, { message: 'Rating must be less than 5.0' })
  rating?: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsBoolean({ message: '$value is not a boolean value' })
  signupComplete?: boolean;
}
