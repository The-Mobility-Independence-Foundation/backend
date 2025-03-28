import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPostalCode, IsString, MaxLength } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    description: 'The first line of the address.',
  })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({
    description: 'The second line of the address.',
    default: '',
  })
  @IsString()
  @MaxLength(100)
  addressLine2: string;

  @ApiProperty({
    description: 'The city',
  })
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'The state',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  state: string;

  @ApiProperty({
    description: 'The postal code',
  })
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  @IsPostalCode('US')
  zipCode: string;
}
