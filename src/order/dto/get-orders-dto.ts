import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../order.entity';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

export class GetOrdersDto extends CursorPaginationDto {
  @IsOptional()
  @ApiPropertyOptional()
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Only get reports from before this date.',
  })
  before?: Date;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Only get reports from after this date.',
  })
  after?: Date;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Only get reports on this date.' })
  on?: Date;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'True => only sent orders; False => only received',
    default: true,
  })
  @IsBoolean()
  sentOnly?: boolean;
}
