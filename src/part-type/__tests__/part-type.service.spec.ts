import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PartType } from '../../part/part.entity';
import { Repository } from 'typeorm';
import { PartTypeService } from '../part-type.service';
import { PaginationService } from '../../common/services/pagination.service';
import { CreatePartTypeDto } from '../dto/create-part-type.dto';
import { CursorPaginationDto } from '../../common/dto/cursor-pagination.dto';
import { GetPartTypesDto } from '../dto/get-part-type.dto';
import { UpdatePartTypeDto } from '../dto/update-part-type.dto';
import { when } from 'jest-when';

describe('PartTypeService', () => {
  let service: PartTypeService;
  let partTypeRepository: Repository<PartType>;
  let paginationService: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartTypeService,
        {
          provide: getRepositoryToken(PartType),
          useValue: createMock<Repository<PartType>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(PartTypeService);
    partTypeRepository = module.get(getRepositoryToken(PartType));
    paginationService = module.get(PaginationService);
  });

  describe('create', () => {
    let createDto = new CreatePartTypeDto();

    beforeEach(() => {
      createDto = new CreatePartTypeDto();
    });

    it('should create a new part type with a DTO', async () => {
      Object.assign(createDto, {
        name: 'wheel',
      });

      await expect(service.create(createDto)).resolves.not.toThrow();
      expect(partTypeRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    let getDto = new GetPartTypesDto();
    const partType = new PartType();

    beforeAll(() => {
      Object.assign(partType, { id: 1, name: 'wheel' });
    });

    beforeEach(() => {
      getDto = new GetPartTypesDto();
    });

    it('should use name search when a name is specified', async () => {
      Object.assign(getDto, {
        name: partType.name,
      });

      service.findAll(getDto);

      expect(paginationService.paginateWithCursor).toHaveBeenCalledWith(
        partTypeRepository,
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
        partTypeRepository,
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
    let updateDto = new UpdatePartTypeDto();
    const partType = new PartType();

    beforeAll(() => {
      Object.assign(partType, { id: 1 });
    });

    beforeEach(() => {
      updateDto = new UpdatePartTypeDto();
    });

    it('Should update the name of a part type if specified', async () => {
      Object.assign(updateDto, {
        name: 'high speed wheel',
      });

      const mockPartType = { ...partType };

      when(partTypeRepository.findOneBy)
        .calledWith({ id: partType.id })
        .mockResolvedValue(mockPartType);

      when(partTypeRepository.save)
        .calledWith(expect.objectContaining({ name: 'high speed wheel' }))
        .mockResolvedValue({ ...mockPartType, name: 'high speed wheel' });

      await expect(
        service.update(partType.id, updateDto),
      ).resolves.not.toThrow();

      expect(partTypeRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'high speed wheel',
        }),
      );
    });
  });

  describe('findOne', () => {
    const partType = new PartType();

    beforeEach(() => {
      Object.assign(partType, { id: 1, name: 'wheel' });
    });

    it('should find a part type if valid id given', async () => {
      when(partTypeRepository.findOne)
        .calledWith({
          where: { id: partType.id },
          relations: { parts: true },
        })
        .mockResolvedValue(partType);

      const result = await service.findOne(1);

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if model type is not found', async () => {
      when(partTypeRepository.findOne)
        .calledWith({ where: { id: 2 }, relations: { parts: true } })
        .mockResolvedValue(null);

      await expect(service.findByIdOrThrow(2)).rejects.toThrow(
        'Part type not found',
      );
    });
  });
});
