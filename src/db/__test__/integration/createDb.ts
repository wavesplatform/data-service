import { compose } from 'ramda';

import { loadConfig } from '../../../loadConfig';
import { createPgDriver } from '../../index';

export default compose(
  createPgDriver,
  loadConfig
);
