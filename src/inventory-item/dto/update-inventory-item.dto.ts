import { PickType } from '@nestjs/mapped-types';
import { CreateInventoryItemDto } from './create-inventory-item.dto';

export class UpdateInventoryItemDto extends PickType(CreateInventoryItemDto, [
  'partId',
  'modelId',
  'inventoryId',
  'quantity',
  'publicCount',
  'notes',
  'attributes',
] as const) {}
