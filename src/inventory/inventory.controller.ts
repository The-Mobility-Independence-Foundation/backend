import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * Create a new inventory
   * @param dto : All the inforamtion to create a new inventory
   */
  @Post()
  @ApiOperation({ summary: 'Initiate creation of an inventory' })
  @ApiResponse({
    status: 201,
    description: 'Inventory successfully created',
  })
  create(@Body() dto: CreateInventoryDto): Promise<Inventory> {
    return this.inventoryService.create(dto);
  }

  /**
   * Get all the inventories of a specific organization
   * @param organizationId : The ID of the organization
   * @returns : A list of all of an organization's inventory
   */
  @Get('organization/:organizationId/inventory')
  @ApiOperation({ summary: 'Retrieve an organizations inventories' })
  findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<Inventory[]> {
    return this.inventoryService.findAll(organizationId);
  }

  /**
   * Get a specific inventory by ID
   * @param id : ID of the specific inventory
   * @param organizationId : ID of the organization
   * @returns : The specific inventory
   */
  @Get('organization/:organizationId/inventory/:id')
  @ApiOperation({
    summary: 'Retrieve a specific inventory from an organization',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<Inventory | null> {
    return this.inventoryService.findOne(id, organizationId);
  }

  /**
   * Update an existing inventory owned by an organization
   * @param organizationId : ID of the organization
   * @param id : ID of the inventory wished to update
   */
  @Patch('organization/:organizationId/inventory/:id')
  @ApiOperation({ summary: 'Update information about an inventory' })
  update(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(organizationId, id, dto);
  }
}
