import { Document, Schema as BSON } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { getAmount } from '../../util/util';

@Schema({
  timestamps: true,
  toJSON: { getters: true },
  id: false,
})
export class Quote extends Document {
  @Prop({
    required: true,
    trim: true,
    type: String,
    uppercase: true,
  })
  symbol: string;

  @Prop({
    required: true,
    trim: true,
    type: BSON.Types.Decimal128,
    default: 0.0,
    get: getAmount,
  })
  price: number;
}

export type QuoteDocument = Quote & { updatedAt: Date; createdAt: Date };

export const QuoteSchema = SchemaFactory.createForClass(Quote);
