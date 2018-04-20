const inputSchema = {
  type: 'array',
  items: {
    type: 'string',
  },
};

const outputSchema = {
  assets: {
    type: 'array',
    items: {
      type: 'object',
    },
  },
};

module.exports = { inputSchema, outputSchema };
