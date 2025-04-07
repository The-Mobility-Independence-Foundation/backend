import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name can not be empty' })
  @MaxLength(50, {
    message: 'Name is too long. Maximum length is $constraint1 characters.',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'First name can not be empty' })
  @MaxLength(20, {
    message:
      'First name is too long. Maximum length is $constraint1 characters.',
  })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Last name can not be empty' })
  @MaxLength(20, {
    message:
      'Last name is too long. Maximum length is $constraint1 characters.',
  })
  lastName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The EIN can not be empty' })
  @MaxLength(10, {
    message: 'EIN is too long. Maximum length is $constraint1 characters.',
  })
  ein: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Email can not be empty' })
  @MaxLength(30, {
    message: 'Email is too long. Maximum length is $constraint1 characters.',
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description can not be empty' })
  @MaxLength(4000, {
    message:
      'Description is too long. Maximum length is $constraint1 characters.',
  })
  description: string;
}
