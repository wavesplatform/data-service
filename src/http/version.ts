import { of as taskOf } from 'folktale/concurrency/task';

const { version } = require('../../package.json');

import { createHttpHandler } from './_common';
import { defaultStringify } from './_common/utils';

export default createHttpHandler(() =>
  taskOf({
    status: 200,
    body: defaultStringify({
      version,
    }),
  })
);
