import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Quote, QuoteDocument } from './entities/quote.entity';
import { Model, Types } from 'mongoose';
import { lastValueFrom, map } from 'rxjs';
import { GenericMatch, IQuote } from './interface/quote';
import { addMinutesToDate } from '../util/util';

@Injectable()
export class QuoteService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configservice: ConfigService,
    @InjectModel(Quote.name)
    private readonly quoteModel: Model<Quote>,
  ) {}

  async create(createQuoteDto: Omit<CreateQuoteDto, 'price'>) {
    const { symbol } = createQuoteDto;
    const data = await this.fetchQuote(symbol);
    return await this.quoteModel.create(data);
  }

  async getQuote(symbol: string) {
    const existingQuote: IQuote = (await this.findOne({
      symbol,
    })) as QuoteDocument;

    if (!existingQuote) {
      return await this.create({ symbol });
    }

    if (new Date() > addMinutesToDate(5, existingQuote.updatedAt)) {
      const updatedQuote = (await this.fetchQuote(symbol)) as UpdateQuoteDto;
      return await this.update({ symbol }, updatedQuote);
    }
    return existingQuote;
  }

  async findOne(
    searchValue: Partial<CreateQuoteDto & { _id: Types.ObjectId }>,
  ): Promise<Quote> {
    return await this.quoteModel.findOne({ ...searchValue });
  }

  async fetchQuote(symbol: string): Promise<CreateQuoteDto> {
    try {
      const API_KEY = this.configservice.get('ALPHA_VANTAGE_API_KEY');
      const baseUrl = this.configservice.get('ALPHA_VANTAGE_BASE_URL');
      return await lastValueFrom(
        this.httpService
          .get(`${baseUrl}&symbol=${symbol}&apikey=${API_KEY}`)
          .pipe(
            map((res) => {
              const response = res.data;
              const price = response['Global Quote']['05. price'];
              return { price: Number(price), symbol } as {
                price: number;
                symbol: string;
              };
            }),
          ),
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(query: GenericMatch, updateQueryDto: UpdateQuoteDto) {
    return await this.quoteModel
      .findOneAndUpdate(query, updateQueryDto, {
        returnDocument: 'after',
      })
      .exec();
  }
}
