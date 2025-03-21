import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
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
  @IsBoolean({ message: '$value is not a boolean value' })
  signupComplete?: boolean;
}
