const EventEmitter = require('events');
const { memoizeWith, always } = require('ramda');

const createEventBus = () => {
  const ee = new EventEmitter();
  const _emit = ee.emit.bind(ee);
  ee.emit = (...args) => _emit('event', ...args);
  return ee;
};

module.exports = memoizeWith(always('eventBus'), createEventBus);
