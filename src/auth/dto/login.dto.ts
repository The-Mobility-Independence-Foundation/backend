import { ApiProperty } from '@nestjs/swagger';
import { UserValidation } from '../../common/validation/user.validation';
import { IsEmail, IsPassword } from '../../common/decorators/user.decorators';

/**
 * The login data (through local auth)
 */
export class LoginDto {
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
