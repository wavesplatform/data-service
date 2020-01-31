import { of as taskOf } from 'folktale/concurrency/task';

import { createHttpHandler } from './_common';
import { HttpResponse } from './_common/types';

export default createHttpHandler(() => taskOf(HttpResponse.NotFound()));
