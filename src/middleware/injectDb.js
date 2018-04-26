const createDb = require('../db');
const inject = require('./inject');

module.exports = options => inject(['db'], createDb(options));
