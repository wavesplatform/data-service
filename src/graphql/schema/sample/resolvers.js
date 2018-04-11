const resolvers = {
  SampleResult: {
    result: (...args) => {
      console.log(args);
      return Promise.resolve('Sample deep resolve result');
    },
  },
  Query: {
    sample: () => 'blah',
    field2: () => 'asd',
  },
};

module.exports = resolvers;
