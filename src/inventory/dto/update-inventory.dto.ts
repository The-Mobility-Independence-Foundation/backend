import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class UpdateInventoryDto {
  @ApiProperty()
  @MaxLength(40, {
    message:
      'Inventory name is too long. Maximum length is $constraint1 characters.',
  })
  name?: string;

  @ApiProperty()
  @MaxLength(200, {
    message:
      'Description is too long. Maximum length is $constraint1 characters.',
  })
  description?: string;

  /*
  @ApiProperty()
  address?: number;
  */
}
