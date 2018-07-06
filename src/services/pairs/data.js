module.exports = ({ postgres }) => ({
  get: postgres.pairs.one,
  mget: postgres.pairs.many,
});
