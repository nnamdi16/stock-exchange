import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { Quote, QuoteSchema } from './entities/quote.entity';
import { getModelToken } from '@nestjs/mongoose';

describe('QuoteController', () => {
  let controller: QuoteController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let quoteModel: Model<Quote>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    quoteModel = mongoConnection.model(Quote.name, QuoteSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [QuoteController],
      providers: [
        QuoteService,
        {
          provide: getModelToken(Quote.name),
          useValue: quoteModel,
        },
      ],
    }).compile();
    controller = app.get<QuoteController>(QuoteController);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     controllers: [QuoteController],
  //     providers: [QuoteService],
  //   }).compile();

  //   controller = module.get<QuoteController>(QuoteController);
  // });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
