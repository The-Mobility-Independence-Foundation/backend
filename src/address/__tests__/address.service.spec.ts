import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address.service';
import { Address } from '../address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { CreateAddressDto } from '../dto/create-address.dto';
import { when } from 'jest-when';
import { NotFoundException } from '@nestjs/common';
import { UpdateAddressDto } from '../dto/update-address.dto';

describe('AddressService', () => {
  let service: AddressService;
  let repository: Repository<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(Address),
          useValue: createMock<Repository<Address>>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>({
            getOrThrow: jest.fn((key: string) => {
              switch (key) {
                case 'RADAR_SECRET_SERVER':
                  return 'test-secret-key';
                case 'RADAR_API_URL':
                  return 'https://test-endpoint.com';
                default:
                  return '';
              }
            }),
          }),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get(AddressService);
    repository = module.get(getRepositoryToken(Address));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new address with the provided information', async () => {
      const dto = new CreateAddressDto();
      const address = new Address();
      Object.assign(dto, {
        addressLine1: 'line 1',
        addressLine2: 'line 2',
        city: 'cityville',
        state: 'statelandia',
        zipCode: '12345',
      });

      Object.assign(address, { ...dto, latitude: 0, longitude: 0 });

      when(repository.save).calledWith(address).mockResolvedValue(address);

      const result = await service.create(dto);

      expect(result).toBeDefined();
      expect(result).toEqual(address);
    });
  });

  describe('findByIdOrThrow', () => {
    it('should throw when given a bad id', async () => {
      const bad_id = 999999999;

      when(repository.findOne)
        .calledWith({ where: { id: bad_id } })
        .mockResolvedValue(null);

      await expect(service.findByIdOrThrow(bad_id)).rejects.toThrow(
        new NotFoundException('Address not found.'),
      );
    });

    it('should not throw when given a good id', async () => {
      const address = new Address();
      Object.assign(address, {
        id: 1,
      });

      when(repository.findOne)
        .calledWith({ where: { id: address.id } })
        .mockResolvedValue(address);

      const result = await service.findByIdOrThrow(address.id);
      expect(result).toBeDefined();
      expect(result).toBe(address);
    });
  });

  describe('findAll', () => {
    it('should find all', async () => {
      const address = new Address();

      when(repository.find).calledWith().mockResolvedValue([address]);

      const result = await service.findAll();
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update the address', async () => {
      const address = new Address();
      Object.assign(address, {
        id: 1,
      });

      const dto = new UpdateAddressDto();
      Object.assign(dto, {
        state: 'ohio',
      });

      when(repository.findOne)
        .calledWith({ where: { id: address.id } })
        .mockResolvedValue(address);
      when(repository.save)
        .calledWith(expect.anything())
        .mockResolvedValue(address);

      const result = await service.update(address.id, dto);

      expect(result).toBeDefined();
    });
  });
});
