import {
  Get,
  Post,
  Param,
  Body,
  Patch,
  ParseIntPipe,
  Query,
  Controller,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GetInventoriesDto } from './dto/get-inventory.dto';
import { BaseApiCursorPaginationResponse } from '../common/responses/base-api-cursor-pagination.response';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';

@ApiTags('inventory')
@UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER)
@Controller('organization/:orgId/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * Create a new inventory
   * @param dto : All the inforamtion to create a new inventory
   */
  @Post('')
  @ApiOperation({ summary: 'Initiate creation of an inventory' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: false })
  create(@Body() dto: CreateInventoryDto): Promise<Inventory> {
    return this.inventoryService.create(dto);
  }

  /**
   * Get all the inventories of a specific organization
   * @param organizationId : The ID of the organization
   * @returns : A list of all of an organization's inventory
   */
  @Get('')
  @ApiOperation({ summary: 'Retrieve an organizations inventories' })
  findAll(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query() query: GetInventoriesDto,
  ): Promise<BaseApiCursorPaginationResponse<Inventory>> {
    return this.inventoryService.findAll(orgId, query);
  }

  /**
   * Get a specific inventory by ID
   * @param id : ID of the specific inventory
   * @param organizationId : ID of the organization
   * @returns : The specific inventory
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a specific inventory from an organization',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Param('orgId', ParseIntPipe) orgId: number,
  ): Promise<Inventory | null> {
    return this.inventoryService.findWithOrganization(id, orgId);
  }

  /**
   * Update an existing inventory owned by an organization
   * @param organizationId : ID of the organization
   * @param id : ID of the inventory wished to update
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update information about an inventory' })
  @UseStrategy(ResourceAccessStrategyToken.PUBLIC_USER, { adminOnly: false })
  update(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(orgId, id, dto);
  }
}
