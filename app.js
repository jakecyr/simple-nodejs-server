const Simple = require('./classes/simple');

// create new simple server with logging
let app = new Simple(true);

app
    .get('/', (req, res) => {
        res.end('here')
    })
    .get('/json-test', (req, res) => {
        res.json({ task: 'Task 1' });
    })
    .listen(8080, '0.0.0.0', () => {
        console.log('Listening')
    });
