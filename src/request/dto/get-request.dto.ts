import {
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { RequestStatus } from '../request.entity';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { CreateRequestDto } from './create-request.dto';

export class GetRequestsDto extends IntersectionType(
  CursorPaginationDto,
  PartialType(
    PickType(CreateRequestDto, [
      'name',
      'firstName',
      'lastName',
      'email',
    ] as const),
  ),
) {
  @IsOptional()
  @ApiPropertyOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Only get requests on this date.' })
  on?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive({ message: 'Invalid approver given.' })
  approverId?: number;
}
