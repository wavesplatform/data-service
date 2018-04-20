const trace = msg => x => {
  // eslint-disable-next-line
  msg ? console.log(msg, x) : console.log(x);
  return x;
};

module.exports = trace;
