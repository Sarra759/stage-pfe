import { Injectable } from '@nestjs/common';
import { DefaultConditionRepository } from '../repositories/default-condition.repository';
import { DefaultConditionEntity } from '../entities/default-condition.entity';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { ResponseDefaultConditionDto } from '../dtos/default-condition.response.dto';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { CreateDefaultConditionDto } from '../dtos/default-condition.create.dto';
import { QuotationService } from 'src/modules/quotation/services/quotation.service';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class DefaultConditionService  extends AbstractCrudService<CreateDefaultConditionDto>{
  constructor(
    private readonly defaultConditionRepository: DefaultConditionRepository
  ) {
    super(defaultConditionRepository);
  }



}
