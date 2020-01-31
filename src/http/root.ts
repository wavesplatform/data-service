import { of as taskOf } from 'folktale/concurrency/task';

const { version } = require('../../package.json');

import { createHttpHandler } from './_common';
import { HttpResponse } from './_common/types';
import { defaultStringify } from './_common/utils';

export default createHttpHandler(() =>
  taskOf(
    HttpResponse.Ok(
      defaultStringify({
        version,
        github: 'https://github.com/wavesplatform/data-service',
        docsUrl: process.env.DOCS_URL ? process.env.DOCS_URL : undefined,
      })
    )
  )
);
