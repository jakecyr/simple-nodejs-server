const Slim = require('../dist/slim.class');

const port = process.env.PORT || 8080;
const host = '0.0.0.0';

// create new Slim server with logging
let app = new Slim(true);

app
    .use(Slim.serveStatic('./public', true))
    .addRoutes('/api', require('./routes'))
    .listen(port, host, () => console.log(`Server listening on ${host}:${port}`));
