import { Injectable } from '@nestjs/common';
import { UpdatePaymentConditionDto } from '../dtos/payment-condition.update.dto';
import { FindManyOptions, FindOneOptions, Not } from 'typeorm';
import { PaymentConditionEntity } from '../entity/payment-condition.entity';
import { ResponsePaymentConditionDto } from '../dtos/payment-condition.response.dto';
import { PaymentConditionNotFoundException } from '../errors/payment-condition.notfound.error';
import { CreatePaymentConditionDto } from '../dtos/payment-condition.create.dto';
import { PaymentConditionAlreadyExistsException } from '../errors/payment-condition.alreadyexists.error';
import { PaymentConditionRestrictedDeleteException } from '../errors/payment-condition.restricted-delete.error';
import { PaymentConditionRepository } from '../repositories/payment-condition.repository';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class PaymentConditionService extends AbstractCrudService<PaymentConditionEntity> {
  constructor(
    private readonly paymentConditionRepository: PaymentConditionRepository,
  ) {
    super(paymentConditionRepository);
  }

}