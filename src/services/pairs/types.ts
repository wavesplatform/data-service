export type Pair = {
  amountAsset: string;
  priceAsset: string;
};

export type MgetRequest = {
  pairs: Pair[];
  matcher: string;
};
