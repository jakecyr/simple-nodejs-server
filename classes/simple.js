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
    function extendRequest(request) {
        request.getQueryString = () => {
            const values = request.url.split('?');
            const queryObj = {};

            for (let value of values) {
                const pieces = value.split('=');

                if (pieces && pieces.length == 2) {
                    queryObj[pieces[0]] = pieces[1];
                }
            }

            return queryObj;
        };
    }
    function listen(port, host, onListen) {
        http
            .createServer((request, response) => {
                const { method, url } = request;
                if (log) console.log(`${method} ${url}`);

                extendRequest(request);
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
