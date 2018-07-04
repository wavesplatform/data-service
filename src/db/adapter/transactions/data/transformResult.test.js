const transformResult = require('./transformResult');

const before = [
  {
    id: 'qwe',
    data_key: 'testint',
    data_type: 'integer',
    data_value_integer: 11,
    data_value_boolean: null,
    data_value_string: null,
    data_value_binary: null,
  },
  {
    id: 'qwe',
    data_key: 'testbool',
    data_type: 'boolean',
    data_value_integer: null,
    data_value_boolean: false,
    data_value_string: null,
    data_value_binary: null,
  },
  {
    id: 'asd',
    data_key: 'teststring',
    data_type: 'string',
    data_value_integer: 11,
    data_value_boolean: null,
    data_value_string: 'some string',
    data_value_binary: null,
  },
  {
    id: 'asd',
    data_key: 'testbinary',
    data_type: 'binary',
    data_value_integer: null,
    data_value_boolean: null,
    data_value_string: null,
    data_value_binary: 'base64:qwerqwer',
  },
];

describe('Data transactions db result transform', () => {
  it('should group raw results by transaction and put nested `data` inside', () => {
    expect(transformResult(before)).toMatchSnapshot();
  });

  it('should handle case when there is no data in tx (all nulls in a row)', () => {
    expect(
      transformResult([
        {
          id: 'asd',
          data_key: null,
          data_type: null,
          data_value_integer: null,
          data_value_boolean: null,
          data_value_string: null,
          data_value_binary: null,
        },
      ])
    ).toMatchSnapshot();
  });

  it('should return empty list for undefined, null or []', () => {
    expect(transformResult()).toEqual([]);
    expect(transformResult(null)).toEqual([]);
    expect(transformResult([])).toEqual([]);
  });
});
