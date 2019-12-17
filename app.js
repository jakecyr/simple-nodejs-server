// import Simple framework
const Simple = require('./classes/simple');

const port = process.env.PORT || 8080;
const host = '0.0.0.0';

// create new simple server with logging
let app = new Simple(true);

app
    .get('/', (req, res) => {
        res.end('here');
    })
    .get('/json-test', (req, res) => {
        res.json({ task: 'Task 1' });
    })
    .post('/add-user', (req, res) => {
        // database insert statement here //
        res.json({ success: true, result: 'Added user' });
    })
    .listen(port, host, () => {
        console.log(`Server listening on ${host}:${port}`);
    });
