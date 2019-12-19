
const Slim = require('../dist/slim.class');

const router = Slim.createRouter();

router
    .get('/', (req, res) => {
        res.end('start route');
    })
    .get('/json-test', (req, res) => {
        res.json({ test: 'test' });
    })
    .post('/', async (req, res) => {
        const payload = await req.body();
        // echo payload
        res.json(payload);
    })
    .put('/', (req, res) => {
        res.json({ success: true, result: 'PUT REQUEST SUCCESS' })
    })
    .delete('/', (req, res) => {
        res.json({ success: true, result: 'DELETE REQUEST SUCCESS' })
    })

module.exports = router;
