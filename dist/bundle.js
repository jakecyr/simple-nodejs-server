"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
};
exports.__esModule = true;
var http_1 = require("http");
var querystring_1 = require("querystring");
var Simple = (function() {
    function Simple(log) {
        this.routes = {
            GET: {},
            POST: {},
            PUT: {},
            DELETE: {}
        };
        this.log = log;
    }
    Simple.prototype.listen = function(port, host, onListen) {
        this.createNewServer().listen(port, host, null, onListen);
    };
    Simple.prototype.request = function(type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.addRequest(type, __spreadArrays(args));
        return this;
    };
    Simple.prototype.get = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.addRequest('GET', args);
        return this;
    };
    Simple.prototype.post = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.addRequest('POST', args);
        return this;
    };
    Simple.prototype.put = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.addRequest('PUT', args);
        return this;
    };
    Simple.prototype["delete"] = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.addRequest('DELETE', args);
        return this;
    };
    Simple.prototype.parseQueryString = function(url) {
        var values = url.split('?');
        var queryObj = {};
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            var pieces = value.split('=');
            if (pieces && pieces.length == 2) {
                queryObj[pieces[0]] = pieces[1];
            }
        }
        return queryObj;
    };
    Simple.prototype.parseBodyJSON = function(request) {
        return new Promise(function(resolve, reject) {
            var body = '';
            request.on('data', function(data) {
                body += data;
                if (body.length > 1e6) {
                    reject('Too much data in request body');
                }
            });
            request.on('end', function() {
                if (body) {
                    try {
                        var payload = JSON.parse(Object.keys(querystring_1.parse(body))[0]);
                        resolve(payload);
                    } catch (e) {
                        reject('Error: Invalid JSON in request body');
                    }
                } else {
                    resolve({});
                }
            });
        });
    };
    Simple.prototype.handleRequest = function(req, res) {
        var method = req.method,
            url = req.url;
        if (this.log) console.log(method + " " + url);
        var baseUrl = url.split('?')[0];
        this.extendRequest(req);
        this.extendResponse(res);
        var methodRoutes = this.routes[method];
        if (methodRoutes && methodRoutes[baseUrl]) {
            this.runHandlers(req, res, __spreadArrays(methodRoutes[baseUrl]));
        } else {
            res.writeHead(404, {
                'Content-Type': 'application/json'
            }).end(JSON.stringify({
                success: false,
                result: "No " + method + " route found matching " + baseUrl
            }));
        }
    };
    Simple.prototype.runHandlers = function(req, res, handlers) {
        var _this = this;
        if (handlers && handlers.length > 0) {
            var handler = handlers.shift();
            if (handlers.length == 0) {
                handler(req, res);
            } else {
                handler(req, res, function() {
                    return _this.runHandlers(req, res, handlers);
                });
            }
        }
    };
    Simple.prototype.createNewServer = function() {
        var _this = this;
        return http_1.createServer(function(req, res) {
            _this.handleRequest(req, res);
        });
    };
    Simple.prototype.addRequest = function(type, args) {
        var path = null;
        var handlers = [];
        if (args.length == 2 && typeof args[0] == 'string' && typeof args[1] == 'function') {
            path = args[0];
            handlers.push(args[1]);
        } else if (args.length > 2 && typeof args[0] == 'string') {
            path = args[0];
            for (var i = 1; i < args.length; i++) {
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
            this.routes[type][path] = handlers;
        } else {
            throw new Error("Must specify a path and at least one route handler");
        }
    };
    Simple.prototype.extendResponse = function(response) {
        response.json = function(json, statusCode) {
            if (statusCode === void 0) {
                statusCode = 200;
            }
            response.writeHead(statusCode, {
                'Content-Type': 'application/json'
            }).end(JSON.stringify(json));
        };
        return response;
    };
    Simple.prototype.extendRequest = function(request) {
        var _this = this;
        request.query = function() {
            return _this.parseQueryString(request.url);
        };
        request.body = function() {
            return _this.parseBodyJSON(request);
        };
    };
    return Simple;
}());
module.exports = Simple;
