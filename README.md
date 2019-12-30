# Slim Node.js HTTP Server

[![Build Status](https://travis-ci.com/jakecyr/slim-node-server.svg?branch=master)](https://travis-ci.com/jakecyr/slim-node-server)

## Installation

* Install the npm package `npm install slim-node-server`
* Import the module to your project (see example below)

## Usage

After installing installing the framework, create a new instance of `Slim` and start creating your server:

```javascript
// import slim framework
const Slim = require('slim-node-server');

// create new slim server with logging
let app = new Slim(true);

app
    .get('/', (req, res) => {
        res.end('nothing here yet');
    })
    .get('/some-json', (req, res) => {
        res.json({ task: 'Task 1' });
    })
    .listen(8080, '0.0.0.0', () => {
        console.log('Listening');
    });
```

### Middleware

* All request types support middleware functions
* The last function must end the response
* All route handler functions are executed in the order they are specified

Example:
```javascript
function log(req, res, next) {
    console.log('LOG VISIT', req.url);
    next();
}

// add middleware to log page url visited to server console
app.get('/', log, (req, res) => {
    res.end('Visit has been logged');
});
```

### Query Parameters

Parse query parameters as needed using the `request` object in a handler function. Example:

```javascript
app.get('/echo-name', (req, res) => {
    const queryParams = req.query();
    res.end(queryParams.name);
})
```

### Body Parsing

Parse a payload body as needed using the `request` object in a handler function. Example:

```javascript
app.post('/', async (req, res) => {
    // wait for all payload data to parse
    const payload = await req.body();

    // echo back the payload to the client
    res.json(payload);
})
```

### Router

Routes can be imported from other files to reduce file size. Example:

```javascript
app
    .addRoutes('/api', require('./routes/'))
    .listen(8080, '0.0.0.0', () => console.log('Server listening'));
```
