import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

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

  @ApiProperty({ type: [Number], required: false })
  @IsInt({ each: true }) 
  @IsPositive({ each: true }) 
  @IsOptional()
  modelTypeIds: number[];
}
