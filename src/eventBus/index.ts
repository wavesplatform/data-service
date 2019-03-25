import { EventEmitter } from 'events';
import { memoizeWith, always } from 'ramda';

const createEventBus = () => new EventEmitter();

export default memoizeWith(always('eventBus'), createEventBus);
