export enum LSNFormat {
  Number = 'number',
  String = 'string',
}

// @todo could we make safer intersection?
// LSN = large significand number
export type LSNSerialization = {
  lsnSerialization: LSNFormat;
};
