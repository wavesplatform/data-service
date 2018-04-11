const fs = require('fs');
// const path = require('path');

// const readFile = (filename, encoding = 'utf8') =>
// 	fs.readFileSync(path.join(__dirname, '../', filename), { encoding });

const readFile = (filename, encoding = 'utf8') =>
  fs.readFileSync(filename, { encoding });

module.exports = readFile;
