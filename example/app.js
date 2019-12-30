const Slim = require('../dist/slim.class');
const path = require('path');

const port = process.env.PORT || 8080;
const host = '0.0.0.0';

// create new Slim server with logging
let app = new Slim();

app
    // add logger for all requests
    .use((req, res, next) => {
        console.log(`${req.method} ${req.url}`);
        next();
    })

    // server static files from the public folder
    .use(Slim.serveStatic(path.join(__dirname, 'public'), true))

    // start listening on the specified host / port
    .listen(port, host, () => console.log(`Server listening on ${host}:${port}`));
