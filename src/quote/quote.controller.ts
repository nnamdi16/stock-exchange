import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FetchQuoteQueryDTO } from './dto/create-quote.dto';
import { QuoteService } from './quote.service';

@Controller('quote')
@ApiTags('Quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get('')
  @ApiResponse({
    status: 200,
    description: ' Quote fetched successfully',
  })
  findOne(@Query() filter: FetchQuoteQueryDTO) {
    return this.quoteService.getQuote(filter.symbol);
  }
}
