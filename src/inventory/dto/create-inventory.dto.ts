import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { CreateAddressDto } from '../../address/dto/create-address.dto';

export class CreateInventoryDto extends PartialType(CreateAddressDto) {
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
}
