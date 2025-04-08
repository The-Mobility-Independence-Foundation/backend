import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Address } from './address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ConfigService } from '@nestjs/config';
import {
  IRadarGeocodeAddress,
  IRadarGeocodeResponse,
} from './interfaces/radar-geocode.interface';

@Injectable()
export class AddressService {
  private readonly RADAR_API_URL: string;
  private readonly RADAR_SECRET_SERVER: string;

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private configService: ConfigService,
  ) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    this.RADAR_API_URL = this.configService.getOrThrow('RADAR_API_URL');
    this.RADAR_SECRET_SERVER = this.configService.getOrThrow(
      isProduction ? 'RADAR_LIVE_SECRET_SERVER' : 'RADAR_TEST_SECRET_SERVER',
    );
  }

  /**
   * Find an address by id
   * @param id - The id of the address
   * @param options - Optional query options
   * @returns The address record
   */
  async findByIdOrThrow(
    id: number,
    options: Partial<{
      where: FindOptionsWhere<Omit<Address, 'id'>>;
      relations: string[] | FindOptionsRelations<Address>;
    }> = {},
  ) {
    const { where = {}, relations } = options;

    const address = await this.addressRepository.findOne({
      where: {
        ...where,
        id,
      },
      relations,
    });

    if (!address) {
      throw new NotFoundException('Address not found.');
    }

    return address;
  }

  async geocode(query: string): Promise<IRadarGeocodeAddress[]> {
    const response = await fetch(
      `${this.RADAR_API_URL}/geocode/forward?query=${query}`,
      {
        headers: {
          Authorization: `Bearer ${this.RADAR_SECRET_SERVER}`,
        },
      },
    );

    if (!response.ok) {
      throw new BadRequestException('Failed to geocode address.');
    }

    const data: IRadarGeocodeResponse = await response.json();

    if (data.addresses.length === 0) {
      throw new BadRequestException('No address found for the given query.');
    }

    return data.addresses;
  }

  /**
   * Create an address
   * @param dto - The address to create
   * @returns The created address
   */
  async create(dto: CreateAddressDto) {
    const address = new Address();

    Object.assign(address, dto);

    return this.addressRepository.save(address);
  }

  /**
   * Update an address
   * @param id - The id of the address to update
   * @param dto - The address to update
   * @returns The updated address
   */
  async update(id: number, dto: UpdateAddressDto) {
    const address = await this.findByIdOrThrow(id);

    Object.assign(address, dto);

    return this.addressRepository.save(address);
  }

  /**
   * Find all addresses
   * @returns All addresses
   */
  async findAll(): Promise<Address[]> {
    return this.addressRepository.find();
  }
}
