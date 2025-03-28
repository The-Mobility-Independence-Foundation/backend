import { PickType } from '@nestjs/swagger';
import { CreateInventoryDto } from './create-inventory.dto';

export class UpdateInventoryDto extends PickType(CreateInventoryDto, [
  'name',
  'description',
]) {}
