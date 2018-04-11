const Mod = require('module');
const _require = Mod.prototype.require;

Mod.prototype.require = function() {
  if (arguments[0].match(/.+\.graphql$/)) {
    const fs = require('fs');
    const path = require('path');
    const callsite = require('callsite');

    // 0 is this file
    // 1 is inner module
    // 2 is the real requester
    const requester = callsite()[2].getFileName();
    const filename = path.join(path.dirname(requester), arguments[0]);
    return fs.readFileSync(filename, {
      encoding: 'utf8',
    });
  }
  return _require.apply(this, arguments);
};
