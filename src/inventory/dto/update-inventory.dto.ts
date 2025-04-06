import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateInventoryDto } from './create-inventory.dto';
import { IsBoolean } from 'class-validator';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @ApiPropertyOptional()
  @IsBoolean()
  restore?: boolean;
}
