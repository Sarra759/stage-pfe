import { Injectable } from '@nestjs/common';
import { QuotationSequentialNotFoundException } from '../errors/quotation.sequential.error';
import { AppConfigEntity } from 'src/shared/app-config/entities/app-config.entity';
import { EventsGateway } from 'src/shared/gateways/events/events.gateway';
import { UpdateQuotationSequenceDto } from '../dtos/quotation-seqence.update.dto';
import { WSRoom } from 'src/app/enums/ws-room.enum';
import { formSequential } from 'src/modules/sequence/utils/sequence.utils';
import { SequenceService } from 'src/modules/sequence/services/sequence.service';
import { SequenceEntity } from 'src/modules/sequence/entities/sequence.entity';
import { Sequences } from 'src/app/enums/sequences.enum';

@Injectable()
export class QuotationSequenceService {
  constructor(
        private readonly sequenceService: SequenceService,
    private readonly wsGateway: EventsGateway,
  ) {}

  async get(): Promise<SequenceEntity> {
    const sequence =
      await this.sequenceService.findBylabel(Sequences.QUOTATION)
    if (!sequence) {
      throw new QuotationSequentialNotFoundException();
    }
    return sequence;
  }

  async set(
    updateQuotationSequenceDto: UpdateQuotationSequenceDto,
  ): Promise<SequenceEntity> {
    const sequence = await this.get();
    const updatedSequence = await this.sequenceService.update(sequence.id, 
      updateQuotationSequenceDto,
    );
    return updatedSequence;
  }

   async getSequential(): Promise<string> {
    const sequence = await this.get();
   await this.set({
  prefix: sequence.prefix,
  dateFormat: sequence.dateFormat,
  next: sequence.next + 1
});
    this.wsGateway.sendToRoom(
      WSRoom.INVOICE_SEQUENCE,
      'quotation-sequence-updated',
      { value: sequence.next + 1 },
    );
    return formSequential(sequence.prefix, sequence.dateFormat, sequence.next);
  }
}


