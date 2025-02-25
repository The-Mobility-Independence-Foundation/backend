import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsPositive } from "class-validator";

export class getInventoryDto {
    @IsOptional()
    @ApiPropertyOptional()
    @IsPositive()
    nextToken?: number;

    @IsOptional()
    @ApiPropertyOptional()
    @IsPositive()
    count?: number;
    
    name?: string;
    organizationId?: number;
    address?: number;
  }