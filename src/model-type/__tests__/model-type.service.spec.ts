import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModelType } from '../../model/model.entity';
import { Repository } from 'typeorm';
import { ModelTypeService } from '../model-type.service';
import { PaginationService } from '../../common/services/pagination.service';
import { CreateModelTypeDto } from '../dto/create-model-type.dto';
import { GetModelTypesDto } from '../dto/get-model-type.dto';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { UpdateModelTypeDto } from '../dto/update-model-type.dto';
import { when } from 'jest-when';

describe('ModelTypeService', () => {
  let service: ModelTypeService;
  let modelTypeRepository: Repository<ModelType>;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelTypeService,
        {
          provide: getRepositoryToken(ModelType),
          useValue: createMock<Repository<ModelType>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(ModelTypeService);
    modelTypeRepository = module.get(getRepositoryToken(ModelType));
    paginationService = module.get(PaginationService);
  });

  describe('create', () => {
    let createDto = new CreateModelTypeDto();

    beforeEach(() => {
      createDto = new CreateModelTypeDto();
    });

    it('should create a new model type with a DTO', async () => {
      Object.assign(createDto, {
        name: 'caine',
      });

      await expect(service.create(createDto)).resolves.not.toThrow();
      expect(modelTypeRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    let getDto = new GetModelTypesDto();
    const modelType = new ModelType();

    beforeAll(() => {
      Object.assign(modelType, { id: 1, name: 'ford' });
    });

    beforeEach(() => {
      getDto = new GetModelTypesDto();
    });

    it('should use name search when a name is specified', async () => {
      Object.assign(getDto, {
        name: modelType.name,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        modelTypeRepository,
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
        modelTypeRepository,
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
    let updateDto = new UpdateModelTypeDto();
    const modelType = new ModelType();

    beforeAll(() => {
      Object.assign(modelType, { id: 1 });
    });

    beforeEach(() => {
      updateDto = new UpdateModelTypeDto();
    });

    it('Should update the name of a model type if specified', async () => {
      Object.assign(updateDto, {
        name: 'power wheelchair',
      });

      const mockModelType = { ...modelType };

      when(modelTypeRepository.findOneBy)
        .calledWith({ id: modelType.id })
        .mockResolvedValue(mockModelType);

      when(modelTypeRepository.save)
        .calledWith(expect.objectContaining({ name: 'power wheelchair' }))
        .mockResolvedValue({ ...mockModelType, name: 'power wheelchair' });

      await expect(
        service.update(modelType.id, updateDto),
      ).resolves.not.toThrow();

      expect(modelTypeRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'power wheelchair',
        }),
      );
    });
  });

  describe('findOne', () => {
    const modelType = new ModelType();

    beforeEach(() => {
      Object.assign(modelType, { id: 1, name: 'Power Chair' });
    });

    it('should find a model type if valid id given', async () => {
      when(modelTypeRepository.findOne)
        .calledWith({
          where: { id: modelType.id },
          relations: { models: true },
        })
        .mockResolvedValue(modelType);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if model type is not found', async () => {
      when(modelTypeRepository.findOne)
        .calledWith({ where: { id: 2 }, relations: { models: true } })
        .mockResolvedValue(null);

      await expect(service.findByIdOrThrow(2)).rejects.toThrow(
        'Model type not found',
      );
    });
  });
});
