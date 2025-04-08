import {
  Get,
  Post,
  Param,
  Body,
  Patch,
  ParseIntPipe,
  Query,
  Controller,
  Delete,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { GetInventoriesDto } from './dto/get-inventory.dto';
import { UseStrategy } from '../common/resource-access/decorators/resource-access.decorator';
import { ResourceAccessStrategyToken } from '../common/resource-access/interfaces/strategy-provider.interface';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('inventory')
@UseStrategy(ResourceAccessStrategyToken.ORGANIZATION_OWNER)
@Controller('organizations/:orgId/inventories')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  /**
   * Create a new inventory
   * @param dto : All the inforamtion to create a new inventory
   */
  @Post()
  @ApiOperation({ summary: 'Initiate creation of an inventory' })
  @ResponseMessage('Successfully created inventory')
  @UseStrategy(ResourceAccessStrategyToken.ORGANIZATION_OWNER, { adminOnly: false })
  create(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Body() dto: CreateInventoryDto,
  ) {
    return this.inventoryService.create(orgId, dto);
  }

  /**
   * Get all the inventories of a specific organization
   * @param organizationId : The ID of the organization
   * @returns : A list of all of an organization's inventory
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve an organizations inventories' })
  @ResponseMessage('Successfully found all inventories')
  findAll(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query() query: GetInventoriesDto,
  ) {
    return this.inventoryService.findAll(orgId, query);
  }

  /**
   * Get a specific inventory by ID
   * @param invId : ID of the specific inventory
   * @param organizationId : ID of the organization
   * @returns : The specific inventory
   */
  @Get(':invId')
  @ApiOperation({
    summary: 'Retrieve a specific inventory from an organization',
  })
  @ResponseMessage('Successfully got inventory information')
  findOne(
    @Param('invId', ParseIntPipe) id: number,
    @Param('orgId', ParseIntPipe) orgId: number,
  ) {
    return this.inventoryService.findWithOrganization(id, orgId);
  }

  /**
   * Update an existing inventory owned by an organization
   * @param organizationId : ID of the organization
   * @param invId : ID of the inventory wished to update
   */
  @Patch(':invId')
  @ApiOperation({ summary: 'Update information about an inventory' })
  @ResponseMessage('Successfully updated inventory')
  @UseStrategy(ResourceAccessStrategyToken.ORGANIZATION_OWNER, { adminOnly: false })
  update(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Param('invId', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(orgId, id, dto);
  }

  /**
   * Soft deletes an existing inventory.
   * @param orgId - ID of the organization
   * @param invId: id of the inventory
   */
  @Delete(':invId')
  @ApiOperation({ summary: 'Delete an inventory. This cannot be undone.' })
  @ResponseMessage('Successfully archived inventory')
  @UseStrategy(ResourceAccessStrategyToken.ORGANIZATION_OWNER, { adminOnly: false })
  delete(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Param('invId', ParseIntPipe) id: number,
  ) {
    return this.inventoryService.delete(orgId, id);
  }
}
