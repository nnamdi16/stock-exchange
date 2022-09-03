import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get<string>(
          'DB_USERNAME',
        )}:${configService.get<string>(
          'DB_PASSWORD',
        )}@cluster0.fkmvzao.mongodb.net/stock-exchange`,
        retryAttempts: 2,
      }),
    }),
  ],
})
export class DatabaseModule {}
