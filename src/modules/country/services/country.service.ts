import { Injectable } from '@nestjs/common';
import { CountryRepository } from '../repositories/country.repository';
import { CountryEntity } from '../entities/country.entity';
import { CreateCountryDto } from '../dtos/country.create.dto';
import { CountryNotFoundException } from '../errors/country.notfound.error';
import { CountryAlreadyExistsException } from '../errors/country.alreadyexists.error';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class CountryService extends AbstractCrudService<CountryEntity>{
  constructor(private readonly countryRepository: CountryRepository) {
    super(countryRepository);
  }

}