import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class SearchUsersDto {
  @IsOptional()
  @ApiPropertyOptional()
  username?: string;

  @IsOptional()
  @ApiPropertyOptional({ enum: UserRole })
  accountType?: UserRole;

  @IsOptional()
  @ApiPropertyOptional()
  @IsBoolean({ message: '$value is not a boolean value' })
  isActive?: boolean;
}

export class GetUsersDto extends IntersectionType(
  CursorPaginationDto,
  SearchUsersDto,
) {}
