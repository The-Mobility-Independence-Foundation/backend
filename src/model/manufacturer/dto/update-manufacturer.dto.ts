import { PickType } from '@nestjs/mapped-types';
import { CreateManufacturerDto } from './create-manufacturer.dto';

export class UpdateManufacturerDto extends PickType(CreateManufacturerDto, [
  'name',
] as const) {}
