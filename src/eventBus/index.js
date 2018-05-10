const EventEmitter = require('events');
const { memoizeWith, always } = require('ramda');

const createEventBus = () => new EventEmitter();
module.exports = memoizeWith(always('eventBus'), createEventBus);
