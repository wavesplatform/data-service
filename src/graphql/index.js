const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');
const { makeExecutableSchema } = require('graphql-tools');
const glue = require('schemaglue');

const { schema, resolver } = glue('src/graphql');

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver,
});

const createGraphQl = context => graphqlKoa(generateOptions(context));
const generateOptions = context => ({ schema: executableSchema, context });
const createGraphiQl = graphiqlKoa;

module.exports = { createGraphQl, createGraphiQl, generateOptions };
