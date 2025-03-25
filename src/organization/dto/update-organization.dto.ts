import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UpdateAddressDto } from '../../address/dto/update-address.dto';

export class UpdateOrganizationDto extends UpdateAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt({ message: 'Invalid ownerId' })
  @IsPositive({ message: 'Invalid ownerId' })
  ownerId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(50, { message: 'Name must be less than 50 characters' })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'phone number must be a string' })
  @MaxLength(20, {
    message: 'phone number must not be more than 20 characters',
  })
  @MinLength(10, {
    message: 'phone number must not be less than 10 characters',
  })
  phonenumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(4000, { message: 'Services must be less than 4000 characters' })
  services?: string;

  @ApiPropertyOptional()
  @IsOptional()
  socials?: string[];
}
