import { PickType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';

export class UpdateInventoryDto extends PickType(CreateInventoryDto, [
  'name',
  'description',
] as const) {}
