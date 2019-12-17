# Simple Node.js HTTP Server

## Installation

* Clone this repo
* Require the `simple.js` file

## Usage

After installing installing the framework, create a new instance of `Simple` and start creating your server:

```javascript
// import simple framework
const Simple = require('./classes/simple');

// create new simple server with logging
let app = new Simple(true);

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

All request types support middleware functions. The last function must end the response. Example:
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
    const queryParams = req.getQueryString();
    res.end(queryParams.name);
})
```
