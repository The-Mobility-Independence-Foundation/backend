import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class getInventoryDto {
  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the next inventory to get.' })
  @IsPositive()
  nextToken?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The number of inventories to get.' })
  @IsPositive()
  count?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The name of the inventory.' })
  @IsPositive()
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the organization.' })
  @IsPositive()
  organizationId?: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'The ID of the address.' })
  @IsPositive()
  address?: number;
}
