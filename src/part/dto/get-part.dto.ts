import { IntersectionType, PartialType } from '@nestjs/swagger';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { CreatePartDto } from './create-part.dto';

export class GetPartsDto extends IntersectionType(
  CursorPaginationDto,
  PartialType(CreatePartDto),
) {}
