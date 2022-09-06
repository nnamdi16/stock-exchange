import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { HttpModule } from '@nestjs/axios';
import { Quote, QuoteSchema } from './entities/quote.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }]),
  ],
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
