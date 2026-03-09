import { Module } from '@nestjs/common';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { PermissionsSeederCommand } from './permissions.seeder';
import { RolesSeederCommand } from './roles.seeder';
import { AdminSeederCommand } from './admin.seeder';
import { CurrenciesSeederCommand } from './currencies.seeder';
import { CurrencyModule } from 'src/modules/currency/currency.module';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { ActivitiesSeederCommand } from './activities.seeders';
import { DefaultConditionModule } from 'src/modules/default-condition/default-condition.module';
import { PaymentConditionsSeederCommand } from './payment-conditons.seeders';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { PaymentConditionModule } from 'src/modules/payment-condition/payment-condition.module';
import { CountryModule } from 'src/modules/country/country.module';
import { countriesSeederCommand } from './countries.seeders';
import { CabinetSeederCommand } from './cabinet.seeders';
import { CabinetModule } from 'src/modules/cabinet/cabinet.module';
import { AddressModule } from 'src/modules/address/address.module';
import { SequenceModule } from 'src/modules/sequence/sequence.module';
import { SequencesSeederCommand } from './sequence.seeders';
@Module({
  providers: [
    PermissionsSeederCommand,
    RolesSeederCommand,
    AdminSeederCommand,
    CurrenciesSeederCommand,
    ActivitiesSeederCommand,
    PaymentConditionsSeederCommand,
    countriesSeederCommand,
    CabinetSeederCommand,
    SequencesSeederCommand
  ],
  imports: [UserManagementModule, CurrencyModule,ActivityModule,PaymentConditionModule,CountryModule,AddressModule,CabinetModule,SequenceModule],
})
export class SeedersModule {}
