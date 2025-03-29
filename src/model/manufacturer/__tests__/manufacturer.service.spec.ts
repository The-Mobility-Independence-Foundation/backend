import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturerService } from '../manufacturer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manufacturer } from '../../model.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { PaginationService } from '../../../common/services/pagination.service';
import { CreateManufacturerDto } from '../dto/create-manufacturer.dto';
import { when } from 'jest-when';
import { GetManufacturersDto } from '../dto/get-manufacturer.dto';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { UpdateManufacturerDto } from '../dto/update-manufacturer.dto';

describe('ManufacturerService', () => {
  let service: ManufacturerService;
  let manufacturerRepository: Repository<Manufacturer>;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManufacturerService,
        {
          provide: getRepositoryToken(Manufacturer),
          useValue: createMock<Repository<Manufacturer>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(ManufacturerService);
    manufacturerRepository = module.get(getRepositoryToken(Manufacturer));
    paginationService = module.get(PaginationService);
  });

  //Tests for create method
  describe('create', () => {
    let createDto = new CreateManufacturerDto();

    beforeEach(() => {
      createDto = new CreateManufacturerDto();
    });

    it('should create a new manufacturer with a DTO', async () => {
      Object.assign(createDto, {
        name: 'Ford',
      });

      await expect(service.create(createDto)).resolves.not.toThrow();
      expect(manufacturerRepository.save).toHaveBeenCalled();
    });
  });

  //Tests for findAll method
  describe('findAll', () => {
    let getDto = new GetManufacturersDto();
    const manufacturer = new Manufacturer();

    beforeAll(() => {
      Object.assign(manufacturer, { id: 1, name: 'ford' });
    });

    beforeEach(() => {
      getDto = new GetManufacturersDto();
    });

    it('should use name search when a tag is specified', async () => {
      Object.assign(getDto, {
        name: manufacturer.name,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        manufacturerRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: {
            name: getDto.name,
          },
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });

    it('should apply pagination parameters correctly', async () => {
      Object.assign(getDto, {
        cursor: '12345',
        limit: 10,
        direction: 'forward',
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        manufacturerRepository,
        expect.objectContaining({
          cursor: getDto.cursor,
          limit: getDto.limit,
          direction: getDto.direction,
        }),
        expect.objectContaining({}),
      );
    });
  });
  //Tests for update method
  describe('update', () => {
    let updateDto = new UpdateManufacturerDto();
    const manufacturer = new Manufacturer();

    beforeAll(() => {
      Object.assign(manufacturer, { id: 1 });
    });

    beforeEach(() => {
      updateDto = new UpdateManufacturerDto();
    });

    it('Should update the name of a manufacturer if specified', async () => {
      Object.assign(updateDto, {
        name: 'General Motors',
      });

      const mockManufacturer = { ...manufacturer };

      when(manufacturerRepository.findOneBy)
        .calledWith({ id: manufacturer.id })
        .mockResolvedValue(mockManufacturer);

      when(manufacturerRepository.save)
        .calledWith(expect.objectContaining({ name: 'General Motors' }))
        .mockResolvedValue({ ...mockManufacturer, name: 'General Motors' });

      await expect(
        service.update(manufacturer.id, updateDto),
      ).resolves.not.toThrow();

      expect(manufacturerRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'General Motors',
        }),
      );
    });
  });

  //Tests for findOne method
  describe('findOne', () => {
    const manufacturer = new Manufacturer();

    beforeEach(() => {
      Object.assign(manufacturer, { id: 1, name: 'Ford' });
    });

    it('should find a manufacturer if valid id given', async () => {
      when(manufacturerRepository.findOne)
        .calledWith({
          where: { id: manufacturer.id },
          relations: { models: true },
        })
        .mockResolvedValue(manufacturer);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if manufacturer is not found', async () => {
      when(manufacturerRepository.findOne)
        .calledWith({ where: { id: 2 }, relations: { models: true } })
        .mockResolvedValue(null);

      await expect(service.findByIdOrThrow(2)).rejects.toThrow(
        'Manufacturer not found',
      );
    });
  });
});
