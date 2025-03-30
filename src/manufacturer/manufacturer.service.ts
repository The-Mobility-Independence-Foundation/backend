import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { Manufacturer } from '../model/model.entity';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { PaginationService } from '../common/services/pagination.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { GetManufacturersDto } from './dto/get-manufacturer.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Get a list of all manufacturers in the database
   * @param query : A query of the information being searched for
   * @returns : A paginated list of all manufacturers
   */
  async findAll(query: GetManufacturersDto) {
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
      this.manufacturerRepository,
      paginationDto,
      {
        cursorColumn: 'id',
        where: findWhere,
        relations: { models: true },
      },
    );
  }

  /**
   * The method used to create a brand new manufacturer in the database
   * @param dto : All the needed information to create a new manufacturer
   * @returns : A success message if it was created properly
   */
  async create(dto: CreateManufacturerDto): Promise<Manufacturer> {
    const manufacturer = new Manufacturer();

    manufacturer.name = dto.name;

    return this.manufacturerRepository.save(manufacturer);
  }

  /**
   * Updating the name of a specific manufacturer
   * @param id : The id of the manufacturer wished to be changed
   * @param dto : The neccessary information to be changed
   * @returns : A success message if the change was completed
   */
  async update(id: number, dto: UpdateManufacturerDto): Promise<Manufacturer> {
    const manufacturer = await this.findByIdOrThrow(id, {
      relations: { models: true },
    });

    const updatedManufacturer = { ...manufacturer };

    if (dto.name) {
      updatedManufacturer.name = dto.name; // Directly modify the property
    }

    return await this.manufacturerRepository.save(updatedManufacturer);
  }

  /**
   * Finding a specific manufacturer
   * @param id : The ID of the manufacturer being looked for
   * @param options : Any relations or specifics being used to search
   * @returns : The specific manufacturer based on the id or an error message if not found
   */
  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Manufacturer, 'id'>>;
      relations: string[] | FindOptionsRelations<Manufacturer>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const manufacturer = await this.manufacturerRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations: relations as string[],
    });

    if (manufacturer) {
      return manufacturer;
    } else {
      throw new NotFoundException('Manufacturer not found');
    }
  }

  async findOne(id: number) {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: {
        id: id,
      },
      relations: { models: true },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    return manufacturer;
  }
}
