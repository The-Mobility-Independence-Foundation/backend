import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '../common/services/pagination.service';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { ModelType } from '../model/model.entity';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { GetModelTypesDto } from './dto/get-model-type.dto';
import { CreateModelTypeDto } from './dto/create-model-type.dto';
import { UpdateModelTypeDto } from './dto/update-model-type.dto';

@Injectable()
export class ModelTypeService {
  constructor(
    @InjectRepository(ModelType)
    private readonly modelTypeRepository: Repository<ModelType>,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Finds all model types for user viewership
   * @param query : Ways to search the model types
   * @returns : A paginated list of model types
   */
  async findAll(query: GetModelTypesDto) {
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
      this.modelTypeRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: findWhere,
        relations: { models: true },
      },
    );
  }

  /**
   * Create a new model type in the database
   * @param dto : All the needed information to create a model type
   * @returns : A success message when created correctly
   */
  async create(dto: CreateModelTypeDto): Promise<ModelType> {
    const modelType = new ModelType();

    modelType.name = dto.name;

    return this.modelTypeRepository.save(modelType);
  }

  /**
   * Changing the name of a pre-existing model type
   * @param id : The id of the model type to be changed
   * @param dto : The `new` name of the model type
   * @returns : A success message when updated
   */
  async update(id: number, dto: UpdateModelTypeDto): Promise<ModelType> {
    const modelType = await this.findByIdOrThrow(id, {
      relations: { models: true },
    });

    const updatedModelType = { ...modelType };

    if (dto.name) {
      updatedModelType.name = dto.name;
    }

    return await this.modelTypeRepository.save(updatedModelType);
  }

  /**
   * Find a specific model type
   * @param id : The id of the model type being searched for
   * @param options : Any possible relations the model type might have
   * @returns : A NotFoundExpection is model type wasn't found or the model type
   */
  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<ModelType, 'id'>>;
      relations: string[] | FindOptionsRelations<ModelType>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const modelType = await this.modelTypeRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (modelType) {
      return modelType;
    } else {
      throw new NotFoundException('Model type not found');
    }
  }

  /**
   * Find a specific model type
   * @param id : The id of the model type being searched for
   * @returns : A NotFoundExpection is model type wasn't found or the model type
   */
  async findOne(id: number) {
    const modelType = await this.modelTypeRepository.findOne({
      where: {
        id: id,
      },
      relations: { models: true },
    });

    if (!modelType) {
      throw new NotFoundException('Model type not found');
    }

    return modelType;
  }
}
