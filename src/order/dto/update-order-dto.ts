import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../order.entity';
import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import { UpdateAddressDto } from '../../address/dto/update-address.dto';

export class UpdateOrderDto extends UpdateAddressDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalid order status provided.' })
  status?: OrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive({ message: 'Invalid provider given.' })
  providerId?: number;
}
