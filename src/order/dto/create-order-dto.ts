import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderDto extends CreateAddressDto {
  @ApiProperty()
  @IsPositive({ message: 'Invalid listingId' })
  @IsNotEmpty({ message: 'No listingId provided' })
  @IsInt()
  listingId: number;

  @ApiProperty()
  @IsPositive({ message: 'Invalid recipientId' })
  @IsNotEmpty({ message: 'No recipientId provided' })
  @IsInt()
  recipientId: number;

  @ApiProperty()
  @IsPositive({ message: 'Invalid quantity' })
  @IsNotEmpty({ message: 'No quantity provided' })
  @IsInt()
  quantity: number;
}
