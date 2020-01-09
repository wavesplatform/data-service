const { BigNumber } = require('@waves/data-entities');

const txExchange = {
  id: '8rEwYY4wQ4bkEkk95EiyeQnvnonX6TAnU6eiBAbVSADk',
  time_stamp: new Date('2017-12-26T09:32:29.000Z'),
  tx_type: 7,
  tx_version: null,
  height: 809923,
  signature:
    'N6p6eqNP8875kd8m3KxwH6MD7RUFA9epdShxSjPJt7YqKa8qF2K9UD2SGNERY9GdfMABRX2KBn1bCdHJym9wBHP',
  proofs: [],
  fee: new BigNumber('1'),
  sender: '3PJaDyprvekvPXPuAtxrapacuDJopgJRaU3',
  sender_public_key: '7kPFrHDiGw1rCm7LPszuECwWYL3dMf6iMifLRDJQZMzy',

  amount_asset: 'BkFyeRdrLquxds5FenxyonyfTwMVJJ6o6L7VTaPr5fs3',
  price_asset: 'WAVES',
  price: new BigNumber('1'),
  amount: new BigNumber('1'),

  sell_matcher_fee: new BigNumber('1'),
  buy_matcher_fee: new BigNumber('1'),
  o1_id: '7tBBYWEQN6BKTAxKMTnwfyyQMzowoukhQd2gbeG8iv4G',
  o1_time_stamp: new Date('2017-12-25T13:39:07.000Z'),
  o1_expiration: new Date('2018-01-14T13:39:07.000Z'),
  o1_signature:
    'v3m2vPv6vAj2fzKAoJaPUKRJ3fezqeNUtne981h7gtyxu4ngrSW8sPr3KroZ9NFXza5hNsLzR9WUVYN7R264Vy8',
  o1_sender: '3PMqzPmPv42PmqsgCgVkUUjWqMpdHxmCmEM',
  o1_sender_public_key: 'FqbiFJELWU8c3iSUEtqhtfRymQPU36FjvdEqSoJVCLFc',
  o1_type: 'buy',
  o1_price: new BigNumber('1'),
  o1_amount: new BigNumber('1'),
  o1_matcher_fee: new BigNumber('1'),
  o2_id: '8JrPB7xdUJeDrjv1ea61qWiLSpPdpjgr6YVi9tmd8aTD',
  o2_time_stamp: new Date('2017-12-26T09:32:28.000Z'),
  o2_expiration: new Date('2018-01-15T09:32:28.000Z'),
  o2_signature:
    '62KNwbcfd5jJ3GDYsFxBDHR9SJXpiz9mcERkK7qNrVx4PTChYSoHycp1NNrNe7Hyy2RmtRcyDZtdHL8S5mKznqJN',
  o2_sender: '3PPAy5ivY9hvDerSZLyRmg3nVo5nKvMJrqV',
  o2_sender_public_key: '5Z8ELnG9f1XSJWPtpoBADApw5PQ1P5USvFnvk1HQW33h',
  o2_type: 'sell',
  o2_price: new BigNumber('1'),
  o2_amount: new BigNumber('1'),
  o2_matcher_fee: new BigNumber('1'),
};

module.exports = {
  txExchange,
};
