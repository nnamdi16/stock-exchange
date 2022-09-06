export interface IQuote {
  symbol: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenericMatch {
  [key: string]: string | number | Date | any;
}
