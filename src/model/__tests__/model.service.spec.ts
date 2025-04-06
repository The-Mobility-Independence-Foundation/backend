import { Test, TestingModule } from '@nestjs/testing';
import { ModelService } from '../model.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Manufacturer, Model, ModelType } from '../model.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { PaginationService } from '../../common/services/pagination.service';
import { ModelTypeService } from '../../model-type/model-type.service';
import { ManufacturerService } from '../../manufacturer/manufacturer.service';
import { CreateModelDto } from '../dto/create-model.dto';
import { when } from 'jest-when';
import { NotFoundException } from '@nestjs/common';
import { GetModelsDto } from '../dto/get-model.dto';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { UpdateModelDto } from '../dto/update-model.dto';

describe('ModelService', () => {
  let service: ModelService;
  let modelRepository: Repository<Model>;
  let paginationService: PaginationService;
  let modelTypeService: ModelTypeService;
  let manufacturerService: ManufacturerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelService,
        {
          provide: getRepositoryToken(Model),
          useValue: createMock<Repository<Model>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(ModelService);
    modelRepository = module.get(getRepositoryToken(Model));
    paginationService = module.get(PaginationService);
    modelTypeService = module.get(ModelTypeService);
    manufacturerService = module.get(ManufacturerService);
  });

  describe('create', () => {
    let createDto = new CreateModelDto();
    const modelType = new ModelType();
    const modelType2 = new ModelType();
    const manufacturer = new Manufacturer();

    beforeAll(() => {
      Object.assign(modelType, { id: 1 });
      Object.assign(modelType2, { id: 2 });
      Object.assign(manufacturer, { id: 1 });
    });

    beforeEach(() => {
      createDto = new CreateModelDto();
    });

    it('should create a new inventory item with a DTO', async () => {
      Object.assign(createDto, {
        manufacturerId: 1,
        name: 'Wheel',
        year: 2014,
        modelTypeIds: [1, 2],
      });

      when(manufacturerService.findByIdOrThrow)
        .calledWith(createDto.manufacturerId)
        .mockResolvedValue(manufacturer);

      when(modelTypeService.findByIdsOrThrow)
        .calledWith(createDto.modelTypeIds)
        .mockResolvedValue([modelType, modelType2]);

      await expect(service.create(createDto)).resolves.not.toThrow();
      expect(modelRepository.save).toHaveBeenCalled();
    });
    it('should throw NotFoundException if Manufactuer is not found', async () => {
      Object.assign(createDto, {
        manufacturerId: 999,
        name: 'Wheel',
        year: 2014,
        modelTypeIds: [1, 2],
      });

      when(manufacturerService.findByIdOrThrow)
        .calledWith(createDto.manufacturerId, expect.any(Object))
        .mockRejectedValue(new NotFoundException('Manufacturer not found'));

      await expect(service.create(createDto)).rejects.toThrow(
        'Manufacturer not found',
      );

      expect(manufacturerService.findByIdOrThrow).toHaveBeenCalledWith(
        createDto.manufacturerId,
        expect.any(Object),
      );
    });

    it('should throw NotFoundException if a single model type is not found', async () => {
      Object.assign(createDto, {
        manufacturerId: 1,
        name: 'Wheel',
        year: 2014,
        modelTypeIds: [1, 3],
      });

      when(modelTypeService.findByIdsOrThrow)
        .calledWith(createDto.modelTypeIds, expect.any(Object))
        .mockRejectedValue(
          new NotFoundException('One or more model types not found'),
        );

      await expect(service.create(createDto)).rejects.toThrow(
        'One or more model types not found',
      );

      expect(modelTypeService.findByIdsOrThrow).toHaveBeenCalledWith(
        createDto.modelTypeIds,
        expect.any(Object),
      );
    });
  });

  describe('findAll', () => {
    let getDto = new GetModelsDto();
    const modelType = new ModelType();
    const manufacturer = new Manufacturer();
    const model = new Model();

    beforeAll(() => {
      Object.assign(modelType, { id: 1 });
      Object.assign(manufacturer, { id: 1 });
      Object.assign(model, { id: 1, name: 'wheel', year: 2009 });
    });

    beforeEach(() => {
      getDto = new GetModelsDto();
    });

    it('should use model type search when a model type is specified', async () => {
      Object.assign(getDto, {
        modelTypeIds: [modelType.id],
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        modelRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            modelTypeIds: [modelType.id],
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });

    it('should use manufacturer search when a manufacturer ID is specified', async () => {
      Object.assign(getDto, {
        manufacturerId: manufacturer.id,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        modelRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            manufacturerId: manufacturer.id,
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });

    it('should use name search when a name is specified', async () => {
      Object.assign(getDto, {
        name: model.name,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        modelRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            name: model.name,
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });

    it('should use year search when a year is specified', async () => {
      Object.assign(getDto, {
        year: model.year,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        modelRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            year: model.year,
          }),
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
        modelRepository,
        expect.objectContaining({
          cursor: getDto.cursor,
          limit: getDto.limit,
          direction: getDto.direction,
        }),
        expect.objectContaining({}),
      );
    });
  });

  describe('update', () => {
    let updateDto = new UpdateModelDto();
    const modelType = new ModelType();
    const model = new Model();
    const manufacturer = new Manufacturer();

    beforeAll(() => {
      Object.assign(modelType, { id: 1, name: 'Example Type' });
      Object.assign(manufacturer, { id: 1 });
      Object.assign(model, {
        id: 1,
        name: 'wheel',
        year: 2001,
        types: [],
      });
    });

    beforeEach(() => {
      updateDto = new UpdateModelDto();
    });

    it('Should update the manufacturer of a model if specified', async () => {
      Object.assign(updateDto, {
        manufacturerId: manufacturer.id,
      });

      when(modelRepository.findOne)
        .calledWith(expect.objectContaining({ where: { id: model.id } }))
        .mockResolvedValue(Promise.resolve(model));

      when(manufacturerService.findByIdOrThrow)
        .calledWith(manufacturer.id)
        .mockResolvedValue(manufacturer);

      await expect(service.update(model.id, updateDto)).resolves.not.toThrow();

      expect(modelRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          manufacturer: manufacturer,
        }),
      );
    });

    it('Should update the name of a model if specified', async () => {
      Object.assign(updateDto, {
        name: 'Offroad Wheel',
      });

      when(modelRepository.findOne)
        .calledWith(expect.objectContaining({ where: { id: model.id } }))
        .mockResolvedValue(Promise.resolve(model));

      await expect(service.update(model.id, updateDto)).resolves.not.toThrow();
      expect(modelRepository.save).toHaveBeenCalled();
    });

    it('Should update the year of a model if specified', async () => {
      Object.assign(updateDto, {
        year: 2020,
      });

      when(modelRepository.findOne)
        .calledWith(expect.objectContaining({ where: { id: model.id } }))
        .mockResolvedValue(Promise.resolve(model));

      await expect(service.update(model.id, updateDto)).resolves.not.toThrow();
      expect(modelRepository.save).toHaveBeenCalled();
    });

    it('Should update the model type of a model if specified', async () => {
      Object.assign(updateDto, {
        modelTypeIds: [modelType.id],
      });

      when(modelRepository.findOne)
        .calledWith(expect.objectContaining({ where: { id: model.id } }))
        .mockResolvedValue(Promise.resolve(model));

      when(modelTypeService.findByIdsOrThrow)
        .calledWith([modelType.id])
        .mockResolvedValue([
          { id: modelType.id, name: 'Example Type' } as ModelType,
        ]);

      await expect(service.update(model.id, updateDto)).resolves.not.toThrow();

      expect(modelRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          types: expect.arrayContaining([
            expect.objectContaining({ id: modelType.id }),
          ]),
        }),
      );
    });
  });

  describe('findOne', () => {
    const model = new Model();

    beforeEach(() => {
      Object.assign(model, { id: 1 });
    });

    it('should find a model if valid id given', async () => {
      when(modelRepository.findOneBy)
        .calledWith(
          expect.objectContaining({
            where: { id: model.id },
            relations: expect.objectContaining({
              manufacturer: true,
              types: true,
              parts: true,
            }),
          }),
        )
        .mockResolvedValue(model);

      const result = await service.findByIdOrThrow(1, {
        relations: ['manufacturer', 'types', 'parts'],
      });

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if model is not found', async () => {
      when(modelRepository.findOne)
        .calledWith(
          expect.objectContaining({
            where: { id: 9999 },
            relations: expect.objectContaining({
              manufacturer: true,
              types: true,
              parts: true,
            }),
          }),
        )
        .mockResolvedValue(null);

      await expect(
        service.findByIdOrThrow(9999, {
          relations: ['manufacturer', 'types', 'parts'],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
