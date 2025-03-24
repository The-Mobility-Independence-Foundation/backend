import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class GetUsersDto extends CursorPaginationDto {
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
