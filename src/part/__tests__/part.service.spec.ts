import { Test, TestingModule } from '@nestjs/testing';
import { PartService } from '../part.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Part, PartType } from '../part.entity';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { PaginationService } from '../../common/services/pagination.service';
import { PartTypeService } from '../../part-type/part-type.service';
import { ModelService } from '../../model/model.service';
import { Model } from '../../model/model.entity';
import { CreatePartDto } from '../dto/create-part.dto';
import { when } from 'jest-when';
import { NotFoundException } from '@nestjs/common';
import { GetPartsDto } from '../dto/get-part.dto';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';

describe('PartService', () => {
  let service: PartService;
  let partRepository: Repository<Part>;
  let paginationService: PaginationService;
  let partTypeService: PartTypeService;
  let modelService: ModelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartService,
        {
          provide: getRepositoryToken(Part),
          useValue: createMock<Repository<Part>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(PartService);
    partRepository = module.get(getRepositoryToken(Part));
    paginationService = module.get(PaginationService);
    partTypeService = module.get(PartTypeService);
    modelService = module.get(ModelService);
  });

  describe('create', () => {
    let createDto = new CreatePartDto();
    const partType = new PartType();
    const partType2 = new PartType();
    const model = new Model();

    beforeAll(() => {
      Object.assign(partType, { id: 1 });
      Object.assign(partType2, { id: 2 });
      Object.assign(model, { id: 1 });
    });

    beforeEach(() => {
      createDto = new CreatePartDto();
    });

    it('should create a new part with a DTO', async () => {
      Object.assign(createDto, {
        name: 'Wheel',
        description: 'Big wheel',
        partNumber: 'AB72',
        modelId: 1,
        partTypeIds: [1, 2],
      });

      when(modelService.findByIdOrThrow)
        .calledWith(createDto.modelId)
        .mockResolvedValue(model);

      when(partTypeService.findByIdsOrThrow)
        .calledWith(createDto.partTypeIds)
        .mockResolvedValue([partType, partType2]);

      await expect(service.create(createDto)).resolves.not.toThrow();
      expect(partRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if Model is not found', async () => {
      Object.assign(createDto, {
        name: 'Wheel',
        description: 'Big wheel',
        partNumber: 'AB72',
        modelId: 999,
        partTypeIds: [1, 2],
      });

      when(modelService.findByIdOrThrow)
        .calledWith(createDto.modelId, expect.any(Object))
        .mockRejectedValue(new NotFoundException('Model not found'));

      await expect(service.create(createDto)).rejects.toThrow(
        'Model not found',
      );

      expect(modelService.findByIdOrThrow).toHaveBeenCalledWith(
        createDto.modelId,
        expect.any(Object),
      );
    });

    it('should throw NotFoundException if a single part type is not found', async () => {
      Object.assign(createDto, {
        name: 'Wheel',
        description: 'Big wheel',
        partNumber: 'AB72',
        modelId: 1,
        partTypeIds: [1, 55],
      });

      when(partTypeService.findByIdsOrThrow)
        .calledWith(createDto.partTypeIds, expect.any(Object))
        .mockRejectedValue(
          new NotFoundException('One or more part types not found'),
        );

      await expect(service.create(createDto)).rejects.toThrow(
        'One or more part types not found',
      );

      expect(partTypeService.findByIdsOrThrow).toHaveBeenCalledWith(
        createDto.partTypeIds,
        expect.any(Object),
      );
    });
  });

  describe('findAll', () => {
    let getDto = new GetPartsDto();
    const partType = new PartType();
    const model = new Model();
    const part = new Part();

    beforeAll(() => {
      Object.assign(partType, { id: 1 });
      Object.assign(model, { id: 1 });
      Object.assign(part, { id: 1, name: 'Wheel', partNumber: 'AB43', modelId: 1 ,partTypeIds: [1] });
    });

    beforeEach(() => {
      getDto = new GetPartsDto();
    });

    
    it('should use part type search when a part type is specified', async () => {
      Object.assign(getDto, {
        partTypeIds: [partType.id],
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        partRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            partTypeIds: [partType.id],
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });

    it('should use model search when a model ID is specified', async () => {
      Object.assign(getDto, {
        modelId: model.id,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        partRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            modelId: model.id,
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });

    
    it('should use name search when a name is specified', async () => {
      Object.assign(getDto, {
        name: part.name,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        partRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            name: part.name,
          }),
          cursorColumn: 'id',
          relations: expect.any(Object),
        }),
      );
    });

    it('should use part number search when a part number is specified', async () => {
      Object.assign(getDto, {
        partNumber: part.partNumber,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        partRepository,
        expect.any(CursorPaginationDto),
        expect.objectContaining({
          where: expect.objectContaining({
            partNumber: part.partNumber,
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
        partRepository,
        expect.objectContaining({
          cursor: getDto.cursor,
          limit: getDto.limit,
          direction: getDto.direction,
        }),
        expect.objectContaining({}),
      );
    });
  });
});
