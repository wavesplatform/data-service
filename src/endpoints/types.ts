import { Task } from 'folktale/concurrency/task';
import { Maybe } from 'folktale/maybe';
import { AppError } from '../errorHandling';

export enum DecimalsFormat {
  Float = 'float',
  Long = 'long',
}

export type WithDecimalsFormat = {
  DecimalsFormat: DecimalsFormat;
};

export type Endpoint<Request, Response> = (
  req: Request
) => Task<AppError, Response>;

export type OneEndpoint<Request, Response> = Endpoint<Request, Maybe<Response>>;

export type ManyEndpoint<Request, Response> = Endpoint<Request, Response[]>;

export type Endpoints<OneRequest, ManyRequest, Response> = {
  one: OneEndpoint<OneRequest, Response>;
  many: ManyEndpoint<ManyRequest, Response>;
};
