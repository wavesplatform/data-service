const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa');
const schema = require('./schema');

const createGraphQl = context => graphqlKoa(generateOptions(context));
const generateOptions = context => ({ schema, context });
const createGraphiQl = graphiqlKoa;

module.exports = { createGraphQl, createGraphiQl, generateOptions };
