declare module 'ramda-adjunct' {
  import { Dictionary } from 'ramda';
  
  var RA: RamdaAdjunct.Static;

  namespace RamdaAdjunct {
    export interface Static {
      renameKeys<T>(keysMap: Dictionary<string>, obj: object): T;
      renameKeys<T>(keysMap: Dictionary<string>): (obj: object) => T;
    }
  }

  export = RA;
}
