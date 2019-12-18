
const Simple = require('../dist/simple.class');

const port = process.env.PORT || 8080;
const host = '0.0.0.0';

// create new simple server with logging
let app = new Simple(true);

app
    .get('/', (req, res) => {
        res.end('start route');
    })
    .get('/json-test', (req, res) => {
        res.json({ test: 'test' });
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
