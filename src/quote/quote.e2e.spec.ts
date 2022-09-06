import { AppModule } from './../app.module';
import { ConfigModule } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { Quote, QuoteSchema } from './entities/quote.entity';
import { QuoteModule } from './quote.module';
import { QuoteService } from './quote.service';
import { factory } from 'fakingoose';

describe('Quotes', () => {
  let app: INestApplication;
  let quoteModel;
  let quoteService: { getQuote: () => [] };
  const quoteFactory = factory<Quote>(QuoteSchema, {}).setGlobalObjectIdOptions(
    {
      tostring: false,
    },
  );
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        QuoteModule,
        ConfigModule,
        AppModule,
        MongooseModule.forRootAsync({
          useFactory: async () => {
            const mongod = await MongoMemoryServer.create();
            const uri = await mongod.getUri();
            return {
              uri,
            };
          },
        }),
      ],
    })
      .overrideProvider(QuoteService)
      .useValue(quoteService)
      .compile();

    app = moduleRef.createNestApplication();
    quoteModel = moduleRef.get<Model<Quote>>(getModelToken(Quote.name));
    await app.init();
  });

  beforeEach(() => {
    // populate the DB with 1 cat using fakingoose
    const mockQuote = quoteFactory.generate();
    return quoteModel.create(mockQuote);
  });

  // afterEach(() => quoteModel.remove({}));

  it('GET quote', () => {
    return request(app.getHttpServer())
      .get('/quote?symbol=ABEO')
      .expect(200)
      .expect((res) => {
        expect(res.body.length > 0).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
