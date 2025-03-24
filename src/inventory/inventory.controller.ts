import {
  Get,
  Post,
  Param,
  Body,
  Patch,
  ParseIntPipe,
  Query,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GetInventoriesDto } from './dto/get-inventory.dto';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organization/:organizationId')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * Create a new inventory
   * @param dto : All the inforamtion to create a new inventory
   */
  @Post('/inventory')
  @ApiOperation({ summary: 'Initiate creation of an inventory' })
  create(@Body() dto: CreateInventoryDto): Promise<Inventory> {
    return this.inventoryService.create(dto);
  }

  /**
   * Get all the inventories of a specific organization
   * @param organizationId : The ID of the organization
   * @returns : A list of all of an organization's inventory
   */
  @Get('/inventory')
  @ApiOperation({ summary: 'Retrieve an organizations inventories' })
  findAll(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Query() query: GetInventoriesDto,
  ): Promise<BaseApiCursorPaginationResponse<Inventory>> {
    return this.inventoryService.findAll(organizationId, query);
  }

  /**
   * Get a specific inventory by ID
   * @param id : ID of the specific inventory
   * @param organizationId : ID of the organization
   * @returns : The specific inventory
   */
  @Get('/inventory/:id')
  @ApiOperation({
    summary: 'Retrieve a specific inventory from an organization',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('organizationId', ParseIntPipe) organizationId: number,
  ): Promise<Inventory | null> {
    return this.inventoryService.findWithOrganization(id, organizationId);
  }

  /**
   * Update an existing inventory owned by an organization
   * @param organizationId : ID of the organization
   * @param id : ID of the inventory wished to update
   */
  @Patch('/inventory/:id')
  @ApiOperation({ summary: 'Update information about an inventory' })
  update(
    @Param('organizationId', ParseIntPipe) organizationId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(organizationId, id, dto);
  }
}
