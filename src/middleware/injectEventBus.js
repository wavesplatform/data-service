const createEventBus = require('../eventBus');
const inject = require('./inject');

module.exports = inject(['eventBus'], createEventBus());
