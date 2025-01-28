import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './request.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
  ) {}

  async create() {
    const request = new Request();
    request.ein = '92-0887459';
    request.firstName = 'Johnathan';
    request.lastName = 'Test';
    request.email = 'johntest@yahoo.gov';
    request.description = 'Let me in!';
    request.name = 'My organization! (so cool!)';

    return this.requestRepository.save(request);
  }

  async findAll() {
    return this.requestRepository.find();
  }

  async findOne(id: number) {
    return this.requestRepository.findOneBy({ id: id });
  }
}
