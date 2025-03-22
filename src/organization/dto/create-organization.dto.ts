import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import {
  IsNotEmpty,
  IsNumberString,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrganizationDto extends CreateAddressDto {
  @ApiProperty()
  @IsPositive({ message: "Invalid ownerId" })
  @IsNotEmpty({ message: "No ownerId provided" })
  ownerId: number;

  @ApiProperty()
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name must not be empty" })
  @MaxLength(50, { message: "Name must be less than 50 characters" })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: "phone number must not be empty" })
  @IsString({ message: "phone number must be a string" })
  @MaxLength(20, { message: "phone number must not be more than 20 characters" })
  @MinLength(10, { message: "phone number must not be less than 10 characters" })
  phone: string;

  @ApiProperty()
  @IsNotEmpty({ message: "ein must not be empty" })
  @IsNumberString({}, { message: "ein must consist of only numbers" })
  @MaxLength(10, { message: "ein must be 10 characters long" })
  @MinLength(10, { message: "ein must be 10 characters long" })
  ein: string;
}
