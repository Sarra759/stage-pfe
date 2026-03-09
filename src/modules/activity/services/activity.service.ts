import { Injectable } from '@nestjs/common';
import { ActivityEntity } from '../entities/activity.entity';
import { CreateActivityDto } from '../dtos/activity.create.dto';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { UpdateActivityDto } from '../dtos/activity.update.dto';
import { ActivityNotFoundException } from '../errors/activity.notfound.error';
import { ActivityAlreadyExistsException } from '../errors/activity.alreadyexists.error';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { ActivityRepository } from '../repositories/activity.repository';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class ActivityService  extends AbstractCrudService<ActivityEntity>{
  constructor(private readonly activityRepository: ActivityRepository) {
    super( activityRepository);
  }


}
