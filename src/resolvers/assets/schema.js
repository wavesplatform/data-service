const inputSchema = {
  type: 'object',
  required: ['ids', 'api'],
  properties: {
    ids: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    api: { type: 'object', properties: { getAssets: { typeof: 'function' } } },
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
