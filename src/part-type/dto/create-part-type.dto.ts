import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePartTypeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name can not be empty' })
  name: string;
}