import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        'mongodb+srv://stock-exchange-user:LJ12CdzWjOqlfyeQ@cluster0.fkmvzao.mongodb.net/stock-exchange',
      ),
  },
];
