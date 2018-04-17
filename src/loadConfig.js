const YAML = require('yamljs');
const path = require('path');

module.exports = () => {
  let config = {};
  try {
    config = YAML.load(path.join(__dirname, '../config.yml'));
  } catch (err) {
    // eslint-disable-next-line
    throw new Error(
      'Unable to read config file. Please add `config.yml` to root folder with necessary parameters'
    );
  }
  return config;
};
