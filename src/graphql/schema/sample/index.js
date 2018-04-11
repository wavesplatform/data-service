const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = require('./types.graphql');
const resolvers = require('./resolvers');
console.log(typeDefs);
module.exports = makeExecutableSchema({ typeDefs, resolvers });
