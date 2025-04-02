import { IntersectionType, PartialType } from '@nestjs/swagger';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { CreateModelDto } from './create-model.dto';

export class GetModelsDto extends IntersectionType(CursorPaginationDto, PartialType(CreateModelDto)) {}
