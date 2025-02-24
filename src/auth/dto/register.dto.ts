import { ApiProperty } from '@nestjs/swagger';
import { UserValidation } from '../../common/validation/user.validation';
import {
  IsFirstName,
  IsLastName,
  IsDisplayName,
  IsEmail,
  IsPassword,
} from '../../common/decorators/user.decorators';

export class UserRegisterDto {
  @IsFirstName()
  @ApiProperty({
    example: 'John',
    minLength: UserValidation.firstName.min,
    maxLength: UserValidation.firstName.max,
  })
  firstName: string;

  @IsLastName()
  @ApiProperty({
    example: 'Doe',
    minLength: UserValidation.lastName.min,
    maxLength: UserValidation.lastName.max,
  })
  lastName: string;

  @IsDisplayName()
  @ApiProperty({
    example: 'john_doe',
    minLength: UserValidation.displayName.min,
    maxLength: UserValidation.displayName.max,
  })
  displayName: string;

  @IsEmail()
  @ApiProperty({
    example: 'john.doe@example.com',
    minLength: UserValidation.email.min,
    maxLength: UserValidation.email.max,
  })
  email: string;

  @IsPassword()
  @ApiProperty({
    example: 'StrongP@ssw0rd',
    minLength: UserValidation.password.min,
    maxLength: UserValidation.password.max,
  })
  password: string;
}
