import { addMinutesToDate, subtractMinutesFromDate } from './../util/util';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Quote } from './entities/quote.entity';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { QuoteService } from './quote.service';
import { Model, Query, Types } from 'mongoose';
import { of } from 'rxjs';
import { createMock } from '@golevelup/ts-jest';
import { AxiosResponse } from 'axios';
import mockedConfigService from '../__mocks__/config.service';
import { IQuote } from './interface/quote';

const mockQuote = (symbol = 'IBM'): Quote =>
  ({
    symbol,
    price: 127.79,
    _id: '631575870a8d16f4660dc12f',
  } as Quote);

const quote = {
  'Global Quote': {
    '01. symbol': 'IBM',
    '02. open': '130.3000',
    '03. high': '130.5600',
    '04. low': '127.2400',
    '05. price': '127.7900',
    '06. volume': '3040813',
    '07. latest trading day': '2022-09-02',
    '08. previous close': '129.6600',
    '09. change': '-1.8700',
    '10. change percent': '-1.4422%',
  },
};
const result: AxiosResponse = {
  data: quote,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

describe('QuoteService', () => {
  let service: QuoteService;
  let httpService: HttpService;
  let spyModel: Model<Quote>;

  beforeEach(async () => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        QuoteService,
        { provide: ConfigService, useValue: mockedConfigService },
        {
          provide: getModelToken(Quote.name),
          // notice that only the functions we call from the model are mocked
          useValue: {
            new: jest.fn().mockResolvedValue(mockQuote()),
            constructor: jest.fn().mockResolvedValue(mockQuote()),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.get<QuoteService>(QuoteService);
    httpService = module.get<HttpService>(HttpService);
    spyModel = module.get<Model<Quote>>(getModelToken(Quote.name));
    module.init();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', async () => {
    jest.spyOn(spyModel, 'findOne').mockReturnValueOnce(
      createMock<Query<IQuote, IQuote>>({
        exec: jest.fn().mockResolvedValueOnce(mockQuote()),
      }) as any,
    );
    const foundQuote = await service.findOne({ symbol: 'IBM' });
    expect(foundQuote).toBeDefined();
  });

  it('should be defined', async () => {
    const data = { price: 127.79, symbol: 'IBM' };
    const symbol = 'IBM';
    jest.spyOn(httpService, 'get').mockReturnValue(of(result));
    expect(await service.fetchQuote(symbol)).toMatchObject(
      expect.objectContaining(data),
    );
  });

  it('should be defined', async () => {
    const data = { price: 127.79, symbol: 'IBM' };
    jest
      .spyOn(spyModel, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockQuote()));
    jest
      .spyOn(service, 'fetchQuote')
      .mockImplementationOnce(() => Promise.resolve(data));
    // const foundQuote = await service.create({ symbol: 'IBM' });
    expect(await service.create({ symbol: 'IBM' })).toMatchObject(
      expect.objectContaining(mockQuote()),
    );
  });

  describe('Get Quote', () => {
    it('should be defined', async () => {
      const symbol = 'IBM';
      const data = {
        price: 127.79,
        symbol: 'MFST',
        _id: new Types.ObjectId('631575870a8d16f4660dc11f'),
        updatedAt: subtractMinutesFromDate(5, new Date()),
        createdAt: subtractMinutesFromDate(5, new Date()),
      } as unknown as Quote & {
        _id: Types.ObjectId;
      };
      jest
        .spyOn(service, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(data));
      expect(await service.getQuote(symbol)).toMatchObject(
        expect.objectContaining(data),
      );
    });

    it('should be defined', async () => {
      const symbol = 'MFST';
      const data = {
        price: 127.79,
        symbol: 'MFST',
        _id: new Types.ObjectId('631575870a8d16f4660dc11f'),
      } as Quote & {
        _id: Types.ObjectId;
      };
      jest
        .spyOn(service, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));
      jest
        .spyOn(service, 'create')
        .mockImplementationOnce(() => Promise.resolve(data));
      expect(await service.getQuote(symbol)).toMatchObject(
        expect.objectContaining(data),
      );
    });

    it('should be defined', async () => {
      const symbol = 'IBM';
      const data = {
        price: 127.79,
        symbol: 'MFST',
        _id: new Types.ObjectId('631575870a8d16f4660dc11f'),
        updatedAt: addMinutesToDate(5, new Date()),
        createdAt: addMinutesToDate(5, new Date()),
      } as unknown as Quote & {
        _id: Types.ObjectId;
      };
      const fetchedQuote = { price: 127.79, symbol: 'IBM' };
      jest
        .spyOn(service, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(data));

      jest
        .spyOn(service, 'fetchQuote')
        .mockImplementationOnce(() => Promise.resolve(fetchedQuote));
      jest
        .spyOn(service, 'update')
        .mockImplementationOnce(() => Promise.resolve(data));
      expect(await service.getQuote(symbol)).toMatchObject(
        expect.objectContaining(data),
      );
    });
  });

  describe('Update Quote', () => {
    it('should be defined', async () => {
      jest.spyOn(spyModel, 'findOneAndUpdate').mockReturnValueOnce(
        createMock<
          Query<
            IQuote & { _id: Types.ObjectId },
            IQuote & { _id: Types.ObjectId }
          >
        >({
          exec: jest.fn().mockResolvedValueOnce(mockQuote()),
        }) as any,
      );

      expect(
        await service.update({ symbol: 'IBM' }, { price: 127.79 }),
      ).toMatchObject(expect.objectContaining(mockQuote()));
    });
  });
});
