const app = require('@waves/koa-server');
const createRouter = require('./router');
app.use(createRouter({ db: null }).routes());

app.listen(3000);

console.log(`
App is ready on:
http://localhost:3000/graphql
http://localhost:3000/graphiql
`);
