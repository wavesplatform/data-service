const YAML = require('yamljs');
const path = require('path');

const { memoizeWith, always } = require('ramda');

const loadConfig = () => {
  let config;
  console.log('Loading config');
  try {
    config = YAML.load(path.join(__dirname, '../config.yml'));
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
    throw new Error(
      'Unable to read config file. Please add `config.yml` to root folder with necessary parameters'
    );
  }
  return config;
};

module.exports = memoizeWith(always('config'), loadConfig);
