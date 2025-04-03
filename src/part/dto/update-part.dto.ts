import { PartialType } from '@nestjs/swagger';
import { CreatePartDto } from './create-part.dto';

export class UpdateModelDto extends PartialType(CreatePartDto) {}