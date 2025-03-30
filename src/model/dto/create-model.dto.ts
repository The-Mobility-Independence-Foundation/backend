import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateModelDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Manufacturer can not be empty' })
  @IsInt()
  @IsPositive()
  manufacturerId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name can not be empty' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Year can not be empty' })
  @IsInt()
  @IsPositive()
  year: number;
}
