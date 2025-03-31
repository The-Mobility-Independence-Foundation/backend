import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from './model.entity';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { CreateModelDto } from './dto/create-model.dto';
import { GetModelsDto } from './dto/get-model.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { ModelTypeService } from '../model-type/model-type.service';
import { ManufacturerService } from '../manufacturer/manufacturer.service';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    private readonly paginationService: PaginationService,
    private readonly modelTypeService: ModelTypeService,
    private readonly manufacturerService: ManufacturerService,
  ) {}

  /**
   * Method used to create a new model
   * @param dto : All the needed informatioin to create a mofel
   * @returns : A success message if it was created properly
   */
  async create(dto: CreateModelDto) {
    const model = new Model();

    model.manufacturer = await this.manufacturerService.findByIdOrThrow(
      dto.manufacturerId,
      {
        relations: { models: true },
      },
    );

    model.year = dto.year;
    model.name = dto.name;
    model.types = await this.modelTypeService.findByIdsOrThrow(
      dto.modelTypeIds,
      {
        relations: { models: true },
      },
    );

    return this.modelRepository.save(model);
  }

  /**
   * Find all models with possible filters
   * @param query : Possible filters when searching
   * @returns : A paginated list of all models
   */
  async findAll(query: GetModelsDto) {
    const findWhere: any = {};

    if (query.name) {
      findWhere.name = query.name;
    }

    if (query.modelTypeIds) {
      findWhere.modelTypeIds = query.modelTypeIds;
    }

    if (query.manufacturerId) {
      findWhere.manufacturerId = query.manufacturerId;
    }

    if (query.year) {
      findWhere.year = query.year;
    }

    const paginationDto = new CursorPaginationDto();
    Object.assign(paginationDto, {
      cursor: query.cursor,
      limit: query.limit,
      direction: query.direction,
    });

    return this.paginationService.paginateWithCursor(
      this.modelRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: findWhere,
        relations: {
          manufacturer: true,
          types: true,
          parts: true,
        },
      },
    );
  }

  /**
   * Find a specific model give an ID
   * @param id : The ID of the model
   * @returns : The model being looked for
   */
  async findOne(id: number) {
    return this.modelRepository.findOneBy({ id: id });
  }

  /**
   * Finds a specific model based on the ID given
   * @param id : ID of the model being looked for
   * @param options : Any specific options needed to search
   * @returns : The model and any information
   */
  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Model, 'id'>>;
      relations: string[] | FindOptionsRelations<Model>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const model = await this.modelRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (model) {
      return model;
    } else {
      throw new NotFoundException('Model not found');
    }
  }

  /**
   * Change the information on a certain model
   * @param id : The ID of the model wished to be changed
   * @param dto : The information to be changed
   * @returns : A success message if updated properly
   */
  async update(id: number, dto: UpdateModelDto): Promise<Model> {
    const model = await this.findByIdOrThrow(id, {
      relations: {
        manufacturer: true,
        types: true,
        parts: true,
      },
    });

    model.name = dto.name;
    model.year = dto.year;

    if (dto.manufacturerId) {
      model.manufacturer = await this.manufacturerService.findByIdOrThrow(
        dto.manufacturerId,
      );
    }

    if (dto.modelTypeIds) {
      model.types = await this.modelTypeService.findByIdsOrThrow(
        dto.modelTypeIds,
      );
    }

    return this.modelRepository.save(model);
  }
}
