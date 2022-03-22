import { RatesMgetService } from '../../../services/rates';
import { createHttpHandler } from '../../_common';
import { parse } from './parse';
import { serialize } from './serialize';

export default (service: RatesMgetService) =>
  createHttpHandler(
    (req, lsnFormat) => service(req).map((res) => serialize(res, lsnFormat)),
    parse
  );
