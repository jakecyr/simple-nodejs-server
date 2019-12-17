const http = require('http');

function Simple(log) {
    let server = null;
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
            methodRoutes[url](req, res);
        } else {
            res.json({ success: false, result: `No ${method} route found matching ${url}` })
        }
    }
    /**
     * Create a new http server
     */
    function createServer() {
        server = http.createServer(handleRequest);
        return server;
    }
    /**
     * Start the server listening on the specified port / host
     * @param {number} port Port to listen on
     * @param {string} host Host to listen on
     * @param {Function} onListen Callback function once the server is listening
     */
    function listen(port, host, onListen) {
        if (!server) createServer();
        server.listen(port, host, onListen);
    }

    /* Request functions */

    /**
     * Handle a specified request type
     * @param {string} type Type of http request
     * @param {string} path Route to handle
     * @param {Function} handler Handler function for the route with (req, res) params
     */
    function request(type, path, handler) {
        routes[type][path] = handler;
        return this;
    }
    /**
     * Handle a GET request
     * @param {string} path Route to handle
     * @param {Function} handler Handler function for the route with (req, res) params
     */
    function get(path, handler) {
        request('GET', path, handler);
        return this;
    }
    /**
     * Handle a port request
     * @param {string} path Route to handle
     * @param {Function} handler Handler function for the route with (req, res) params
     */
    function post(path, handler) {
        request('POST', path, handler);
        routes.POST[path] = handler;
        return this;
    }
    /**
     * Handle a PUT request
     * @param {string} path Route to handle
     * @param {Function} handler Handler function for the route with (req, res) params
     */
    function put(path, handler) {
        request('PUT', path, handler);
        return this;
    }
    /**
     * Handle a DELETE request
     * @param {string} path Route to handle
     * @param {Function} handler Handler function for the route with (req, res) params
     */
    function deleteRequest(path, handler) {
        request('DELETE', path, handler);
        return this;
    }
}

module.exports = Simple;
