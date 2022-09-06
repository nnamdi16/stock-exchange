import { addMinutesToDate } from './../util/util';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { Model, Types } from 'mongoose';
import { Quote } from './entities/quote.entity';
import { getModelToken } from '@nestjs/mongoose';
import * as sinon from 'sinon';

describe('QuoteController', () => {
  let controller: QuoteController;
  let service: QuoteService;
  const data = {
    price: 127.79,
    symbol: 'MFST',
    _id: new Types.ObjectId('631575870a8d16f4660dc11f'),
    updatedAt: addMinutesToDate(5, new Date()),
    createdAt: addMinutesToDate(5, new Date()),
  } as unknown as Quote & {
    _id: Types.ObjectId;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [QuoteController],
      providers: [
        {
          provide: QuoteService,
          useValue: {
            getQuote: jest.fn().mockResolvedValue(data),
          },
        },
        ConfigService,
        {
          provide: getModelToken(Quote.name),
          useValue: sinon.createStubInstance(Model),
        },
      ],
    }).compile();

    controller = module.get<QuoteController>(QuoteController);
    service = module.get<QuoteService>(QuoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Fetch Quote', () => {
    it('should fetch quote for a symbool', () => {
      expect(controller.findOne({ symbol: 'MFST' })).resolves.toEqual(data);
    });
  });
});
