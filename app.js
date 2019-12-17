// import Simple framework
const Simple = require('./classes/simple');

const port = process.env.PORT || 8080;
const host = '0.0.0.0';

// create new simple server with logging
let app = new Simple(true);

function log(req, res, next) {
    console.log('LOG', req.url);
    next();
}

app
    .get('/', log, (req, res) => {
        res.end('start route');
    })
    .post('/', (req, res) => {
        res.end('post data here')
    })
    .put('/', (req, res) => {
        res.end('put data here')
    })
    .delete('/', (req, res) => {
        res.end('delete data here')
    })
    .listen(port, host, () => {
        console.log(`Server listening on ${host}:${port}`);
    });
