import { of as taskOf } from 'folktale/concurrency/task';

import { createHttpHandler } from './_common';
import { defaultStringify } from './_common/utils';
import { DEFAULT_NOT_FOUND_MESSAGE } from '../errorHandling';

export default createHttpHandler(() =>
  taskOf({
    status: 404,
    body: defaultStringify({
      message: DEFAULT_NOT_FOUND_MESSAGE,
    }),
  })
);
