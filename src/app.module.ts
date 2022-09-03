import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { ConfigModule } from '@nestjs/config';
import { QuoteModule } from './quote/quote.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QuoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
@Global()
export class AppModule {}
