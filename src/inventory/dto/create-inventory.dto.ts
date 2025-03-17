import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, MaxLength } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty({ message: 'Organization cannot be blank' })
  organizationId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Inventory name cannot be blank.' })
  @MaxLength(40, {
    message:
      'Inventory name is too long. Maximum length is $constraint1 characters.',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description cannot be blank.' })
  @MaxLength(200, {
    message:
      'Description is too long. Maximum length is $constraint1 characters.',
  })
  description: string;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty({ message: 'Address cannot be blank.' })
  address: number;
}
