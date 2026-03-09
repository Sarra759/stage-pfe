import { DateFormat } from "src/modules/sequence/enums/date-format.enum";

export interface QuotationSequence {
  prefix: string;
  dynamicSequence: DateFormat;
  next: number;
}
