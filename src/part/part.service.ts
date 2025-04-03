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

@Injectable()
export class PartService {
  constructor(
    @InjectRepository(Part)
    private readonly partRepository: Repository<Part>,
    private readonly modelService: ModelService,
    private readonly partTypeService: PartTypeService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(dto: CreatePartDto) {
    const part = new Part();

    part.model = await this.modelService.findByIdOrThrow(dto.modelId,
      {
        relations: { 
          manufacturer: true,
          parts: true,
         },
      },
    );

    part.types = await this.partTypeService.findByIdsOrThrow(
      dto.partTypeIds,
      {
        relations: { parts: true },
      },
    );

    part.name = dto.name;
    part.description = dto.description;
    part.partNumber = dto.partNumber;

    return this.partRepository.save(part);
  }

  async findAll(query: GetPartsDto) {
    const findWhere: any = {};

    if (query.name) {
      findWhere.name = query.name;
    }

    if (query.partTypeIds) {
      findWhere.partTypeIds = query.partTypeIds;
    }

    if (query.modelId) {
      findWhere.modelId = query.modelId;
    }

    if (query.partNumber) {
      findWhere.partNumber = query.partNumber;
    }

    if (query.description) {
      findWhere.description = query.description;
    }

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
}
