const resolvers = {
  SampleResult2: {
    result: (...args) => {
      console.log(args);
      return Promise.resolve('Sample deep resolve result222');
    },
  },
  Query: {
    sample2: () => 'blah',
  },
};

exports.resolver = resolvers;
