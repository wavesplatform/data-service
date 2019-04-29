const { renameKeys } = require('ramda-adjunct');

module.exports = renameKeys({ tx_type: 'type', time_stamp: 'timestamp' });
