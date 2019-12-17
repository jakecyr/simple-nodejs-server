const http = require('http');

function Simple(log) {
    let routes = {
        GET: {},
        POST: {},
        PUT: {},
        DELETE: {},
    };

    /* Expose public functions */

    this.request = request;
    this.get = get;
    this.post = post;
    this.put = put;
    this.delete = deleteRequest;
    this.listen = listen;

    ////////////

    /**
     * Extend the response object with additional properties
     * @param {object} response Http response object
     */
    function extendResponse(response) {
        response.json = (json, statusCode = 200) => {
            response
                .writeHead(statusCode, { 'Content-Type': 'application/json' })
                .end(JSON.stringify(json))
        };

        return response;
    }
    /**
     * Extend the request object with additional properties
     * @param {object} request Http request object
     */
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
    /**
     * Handle an incoming request
     * @param {object} req Http Request object
     * @param {object} res Http Response object
     */
    function handleRequest(req, res) {
        const { method, url } = req;
        if (log) console.log(`${method} ${url}`);

        extendRequest(req);
        extendResponse(res);

        const methodRoutes = routes[method];

        if (methodRoutes && methodRoutes[url]) {
            runHandlers(req, res, [...methodRoutes[url]]);
        } else {
            res
                .writeHead(404, { 'Content-Type': 'application/json' })
                .end(JSON.stringify({ success: false, result: `No ${method} route found matching ${url}` }))
        }
    }
    function runHandlers(req, res, handlers) {
        if (handlers && handlers.length > 0) {
            const handler = handlers.shift();

            if (handlers.length == 0) {
                handler(req, res);
            } else {
                handler(req, res, () => runHandlers(req, res, handlers));
            }
        }
    }
    /**
     * Create a new http server
     */
    function createServer() {
        return http.createServer(handleRequest);
    }
    /**
     * Start the server listening on the specified port / host
     * @param {number} port Port to listen on
     * @param {string} host Host to listen on
     * @param {Function} onListen Callback function once the server is listening
     */
    function listen(port, host, onListen) {
        const server = createServer();
        server.listen(port, host, onListen);
    }

    /* Request functions */

    /**
     * Handle a specified request type
     * @param {string} type Type of http request
     * @param {string} path Route to handle
     * @param {Function[]} handlers Handler functions for the route with (req, res) params
     */
    function request(type, path, handlers) {
        routes[type][path] = handlers;
        return this;
    }
    function addRequest(type, args) {
        let path = null;
        let handlers = [];

        if (args.length == 2 && typeof args[0] == 'string' && typeof args[1] == 'function') {
            path = args[0];
            handlers.push(args[1]);
        } else if (args.length > 2 && typeof args[0] == 'string') {
            path = args[0];

            for (let i = 1; i < args.length; i++) {
                if (typeof args[i] == 'function') {
                    handlers.push(args[i]);
                } else {
                    throw new Error('Argument after path is not a function');
                }
            }
        } else {
            throw new Error('Invalid arguments');
        }

        if (path && handlers.length > 0) {
            request(type, path, handlers);
        } else {
            throw new Error(`Must specify a path and at least one route handler`);
        }

    }
    function get(...args) {
        addRequest('GET', args);
        return this;
    }
    function post(...args) {
        addRequest('POST', args);
        return this;
    }
    function put(...args) {
        addRequest('PUT', args);
        return this;
    }
    function deleteRequest(...args) {
        addRequest('DELETE', args);
        return this;
    }
}

module.exports = Simple;
