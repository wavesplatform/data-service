require('./requirePatch'); // enable .graphql extensions
const app = require('@waves/koa-server');
const createRouter = require('./router');
app.use(createRouter({ db: null }).routes());

app.listen(3000);

console.log(`
App is ready on
\t\t\thttp://localhost:3000/graphql
\t\t\thttp://localhost:3000/graphiql
`);
