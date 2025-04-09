import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Part } from './part.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { ModelService } from '../model/model.service';
import { PartTypeService } from '../part-type/part-type.service';
import { PaginationService } from '../common/services/pagination.service';
import { CreatePartDto } from './dto/create-part.dto';
import { GetPartsDto } from './dto/get-part.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { UpdatePartDto } from './dto/update-part.dto';

@Injectable()
export class PartService {
  constructor(
    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,
    private readonly modelService: ModelService,
    private readonly partTypeService: PartTypeService,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Method used to create a new part
   * @param dto : All needed information to create a part
   * @returns : A success message if it was created properly
   */
  async create(dto: CreatePartDto) {
    const part = new Part();

    part.model = await this.modelService.findByIdOrThrow(dto.modelId, {
      relations: {
        manufacturer: true,
        parts: true,
      },
    });

    part.types = await this.partTypeService.findByIdsOrThrow(dto.partTypeIds, {
      relations: { parts: true },
    });

    part.name = dto.name;
    part.description = dto.description;
    part.partNumber = dto.partNumber;

    return this.partRepository.save(part);
  }

  /**
   * Find all parts with possible filters
   * @param query : Possible filters when searching
   * @returns : A paginated list of all parts
   */
  async findAll(query: GetPartsDto) {
    const findWhere = Object.assign(
      {},
      query.name && { name: query.name },
      query.partTypeIds && { partTypeIds: query.partTypeIds },
      query.modelId && { modelId: query.modelId },
      query.partNumber && { partNumber: query.partNumber },
      query.description && { description: query.description },
    );

    const paginationDto = new CursorPaginationDto();
    Object.assign(paginationDto, {
      cursor: query.cursor,
      limit: query.limit,
      direction: query.direction,
    });

    return this.paginationService.paginateWithCursor(
      this.partRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: findWhere,
        relations: {
          model: true,
          types: true,
        },
      },
    );
  }

  /**
   * Find a specific part give an ID
   * @param id : The ID of the part
   * @returns : The part being looked for
   */
  async findOne(id: number) {
    return this.partRepository.findOneBy({ id: id });
  }

  /**
   * Finds a specific part based on the ID given
   * @param id : The ID of the specific part given
   * @param options : Any specific options needed to search
   * @returns : The part and any information
   */
  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Part, 'id'>>;
      relations: string[] | FindOptionsRelations<Part>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const part = await this.partRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (part) {
      return part;
    } else {
      throw new NotFoundException('Part not found');
    }
  }

  /**
   * Change the information on a certain part
   * @param id : The Id of the part being changed
   * @param dto : The information to be changed
   * @returns : A success message if updated properly
   */
  async update(id: number, dto: UpdatePartDto): Promise<Part> {
    const part = await this.findByIdOrThrow(id, {
      relations: {
        model: true,
        types: true,
      },
    });

    part.name = dto.name ?? part.name;
    part.partNumber = dto.partNumber ?? part.partNumber;
    part.description = dto.description ?? part.description;

    if (dto.modelId) {
      part.model = await this.modelService.findByIdOrThrow(dto.modelId);
    }

    if (dto.partTypeIds) {
      part.types = await this.partTypeService.findByIdsOrThrow(dto.partTypeIds);
    }

    return this.partRepository.save(part);
  }
}
