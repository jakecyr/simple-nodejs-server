
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
    .post('/', async (req, res) => {
        const payload = await req.body();

        console.log(payload);

        res.json(payload);
    })
    .put('/', (req, res) => {
        res.json({ success: true, result: 'PUT REQUEST SUCCESS' })
    })
    .delete('/', (req, res) => {
        res.json({ success: true, result: 'DELETE REQUEST SUCCESS' })
    })
    .listen(port, host, () => {
        console.log(`Server listening on ${host}:${port}`);
    });
