export enum MoneyFormat {
  Float = 'float',
  Long = 'long',
}

export type WithMoneyFormat = {
  moneyFormat: MoneyFormat;
};
