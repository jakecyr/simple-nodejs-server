
const Simple = require('../dist/simple.class');

const router = Simple.createRouter();

router
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

module.exports = router;
