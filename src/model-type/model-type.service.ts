import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//import { PaginationService } from '../common/services/pagination.service';
import { Repository } from 'typeorm';
import { ModelType } from '../model/model.entity';

@Injectable()
export class ModelTypeService {
  constructor(
    @InjectRepository(ModelType)
    private readonly modelTypeRepository: Repository<ModelType>,
    //private readonly paginationService: PaginationService,
  ) {}
}
