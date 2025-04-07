import { ApiPropertyOptional } from '@nestjs/swagger';
import { RequestStatus } from '../request.entity';
import { IsDate, IsEnum, IsOptional, IsPositive } from 'class-validator';

export class UpdateRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(RequestStatus, { message: 'Invalid request status provided.' })
  status?: RequestStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive({ message: 'Invalid approver given.' })
  approverId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  actionTakenOn: Date;
}
