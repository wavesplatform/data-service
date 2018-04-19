const { compose } = require('ramda');

module.exports = compose(require('./adapter'), require('./connect'));
