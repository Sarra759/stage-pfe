import { Currency } from './currency';
import { PagedResponse } from './response';
import { DatabaseEntity } from './response/DatabaseEntity';

export interface BankAccount extends DatabaseEntity {
  id?: number;
  name?: string;
  bic?: string;
  rib?: string;
  iban?: string;
  currency?: Currency;
  currencyId?: number;
  isMain?: boolean;
}

export interface CreateBankAccountDto
  extends Omit<BankAccount, 'id' | 'currency' | 'isDeletionRestricted'> {}
export interface UpdateBankAccountDto
  extends Omit<BankAccount, 'currency' | 'isDeletionRestricted'> {}
export interface PagedBankAccount extends PagedResponse<BankAccount> {}


import { ResponseUserDto } from './user';

export interface SigninPayload {
  usernameOrEmail: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

export interface ResponseSigninDto {
  user: ResponseUserDto;
  access_token: string;
  refresh_token: string;
}

export interface ResponseSignupDto {
  user: ResponseUserDto;
}

export interface SigninPayload {
  usernameOrEmail: string;
  password: string;
}

export interface SignupPayload {
  // your signup payload fields
  username: string;
  email: string;
  password: string;
}