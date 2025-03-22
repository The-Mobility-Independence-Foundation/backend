import { PickType } from '@nestjs/mapped-types';
import { CreateInventoryItemDto } from './create-inventory-item.dto';

export class UpdateInventoryItemDto extends PickType(CreateInventoryItemDto, [
  'part',
  'model',
  'inventory',
  'quantity',
  'publicCount',
  'notes',
  'attributes',
] as const) {}
