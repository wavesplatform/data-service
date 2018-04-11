const app = require('@waves/koa-server');
const createRouter = require('./router');

app.use(createRouter({ db: null }).routes());

app.listen(3000);
