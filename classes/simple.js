const http = require('http');

function Simple(log) {
    let routes = {};

    function extendResponse(response) {
        response.json = (json, statusCode = 200) => {
            response
                .writeHead(statusCode, { 'Content-Type': 'application/json' })
                .end(JSON.stringify(json))
        };

        return response;
    }
    function listen(port, host, onListen) {
        http
            .createServer((request, response) => {
                const { method, url } = request;
                if (log) console.log(`${method} ${url}`);

                extendResponse(response);

                if (routes[url]) {
                    routes[url](request, response);
                } else {
                    response.json({ error: true, message: 'No route found' })
                }
            })
            .listen(port, host, onListen)
    }
    function get(path, handler) {
        routes[path] = handler;
        return this;
    }

    this.get = get;
    this.listen = listen;
}

module.exports = Simple;
