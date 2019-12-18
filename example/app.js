
const Simple = require('../dist/simple.class');

const port = process.env.PORT || 8080;
const host = '0.0.0.0';

// create new simple server with logging
let app = new Simple(true);

app
    .addRoutes('/api', require('./routes'))
    .listen(port, host, () => {
        console.log(`Server listening on ${host}:${port}`);
    });
