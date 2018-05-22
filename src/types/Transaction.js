const Transaction = (data = null) => ({
  __type: 'transaction',
  data,
});

module.exports = Transaction;
