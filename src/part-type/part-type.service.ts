import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { PartType } from '../part/part.entity';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { GetPartTypesDto } from './dto/get-part-type.dto';
import { CreatePartTypeDto } from './dto/create-part-type.dto';
import { UpdatePartTypeDto } from './dto/update-part-type.dto';

@Injectable()
export class PartTypeService {
  constructor(
    @InjectRepository(PartType)
    private readonly partTypeRepository: Repository<PartType>,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Finds all part types for user viewership
   * @param query : Ways to search the part types
   * @returns : A paginated list of part types
   */
  async findAll(query: GetPartTypesDto) {
    const findWhere: any = {
      name: query.name,
    };

    const paginationDto = new CursorPaginationDto();
    Object.assign(paginationDto, {
      cursor: query.cursor,
      limit: query.limit,
      direction: query.direction,
    });

    return this.paginationService.paginateWithCursor(
      this.partTypeRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: findWhere,
        relations: { parts: true },
      },
    );
  }

  /**
   * Create a new part type in the database
   * @param dto : All the needed information to create a part type
   * @returns : A success message when created correctly
   */
  async create(dto: CreatePartTypeDto): Promise<PartType> {
    const partType = new PartType();

    partType.name = dto.name;

    return this.partTypeRepository.save(partType);
  }

  /**
   * Changing the name of a pre-existing part type
   * @param id : The id of the part type to be changed
   * @param dto : The `new` name of the part type
   * @returns : A success message when updated
   */
  async update(id: number, dto: UpdatePartTypeDto): Promise<PartType> {
    const partType = await this.findByIdOrThrow(id, {
      relations: { parts: true },
    });

    const updatedPartType = { ...partType };

    if (dto.name) {
      updatedPartType.name = dto.name;
    }

    return await this.partTypeRepository.save(updatedPartType);
  }

  /**
   * Find a specific part type
   * @param id : The id of the part type being searched for
   * @param options : Any possible relations the part type might have
   * @returns : A NotFoundExpection is part type wasn't found or the part type
   */
  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<PartType, 'id'>>;
      relations: string[] | FindOptionsRelations<PartType>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const partType = await this.partTypeRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (partType) {
      return partType;
    } else {
      throw new NotFoundException('Part type not found');
    }
  }

  /**
   * Find a specific part type
   * @param id : The id of the part type being searched for
   * @returns : A NotFoundExpection is part type wasn't found or the part type
   */
  async findOne(id: number) {
    const partType = await this.partTypeRepository.findOne({
      where: {
        id: id,
      },
      relations: { parts: true },
    });

    if (!partType) {
      throw new NotFoundException('Part type not found');
    }

    return partType;
  }

  async findByIdsOrThrow(
    ids: number[],
    options: Partial<{
      where: FindOptionsWhere<Omit<PartType, 'id'>>;
      relations: string[] | FindOptionsRelations<PartType>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const partTypes = await this.partTypeRepository.find({
      where: {
        ...where,
        id: In(ids),
      },
      relations: relations as string[],
    });

    if (partTypes.length === ids.length) {
      return partTypes;
    } else {
      throw new NotFoundException('One or more part types not found');
    }
  }
}
