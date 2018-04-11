const { mergeSchemas } = require('graphql-tools');

const sampleSchema = require('./sample');
// const sample2Schema = require('./sample2');

// module.exports = sampleSchema;
module.exports = mergeSchemas({ schemas: [sampleSchema] });
