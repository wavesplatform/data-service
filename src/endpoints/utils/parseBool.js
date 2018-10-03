const parseBool = maybeBool => {
  if (typeof maybeBool === 'string') {
    switch (true) {
      case maybeBool === '':
      case maybeBool.toLowerCase() === 'false':
      case maybeBool === '0':
      case maybeBool.toLowerCase() === 'null':
      case maybeBool === 'undefined':
      case maybeBool === 'NaN':
        return false;
      default:
        return true;
    }
  } else return !!maybeBool;
};

module.exports = { parseBool };
