import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import {
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrganizationDto extends CreateAddressDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  ownerId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @MinLength(10)
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(10)
  ein: string;
}
