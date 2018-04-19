const inputSchema = {
  type: 'object',
  required: ['ids', 'db'],
  properties: {
    ids: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    db: { type: 'object', properties: { assets: { typeof: 'function' } } },
  },
};

const outputSchema = {
  type: 'object',
  required: ['assets'],
  properties: {
    assets: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
  },
};

module.exports = { inputSchema, outputSchema };
