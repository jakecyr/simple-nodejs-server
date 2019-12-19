import { createServer, Server } from 'http';
import { parse as parseBody } from 'querystring';
import { readFile, exists, stat as fileStat } from 'fs';
import { resolve as resolvePath, normalize as normalizePath, join as joinPath } from 'path';

import { EXT_CONTENT_TYPE } from './file-ext.object';
import { SlimRequest } from './slim-request.interface';
import { SlimResponse } from './slim-response.interface';
import { HandlerFunction } from './handler-function.type';
import { SlimRoutes } from './slim-routes.interface';

class Slim {

    private routes: SlimRoutes = {
        GET: {},
        POST: {},
        PUT: {},
        DELETE: {},
    };

    private log: boolean;
    private middleware: HandlerFunction[] = [];

    constructor(log: boolean) {
        this.log = log;
    }
    listen(port: number, host: string, onListen: () => void): void {
        this.createNewServer().listen(port, host, null, onListen);
    }
    request(type: string, ...args: any[]): Slim {
        this.addRequest(type, [...args]);
        return this;
    }
    get(...args: any[]): Slim {
        this.addRequest('GET', args);
        return this;
    }
    post(...args: any[]): Slim {
        this.addRequest('POST', args);
        return this;
    }
    put(...args: any[]): Slim {
        this.addRequest('PUT', args);
        return this;
    }
    delete(...args: any[]): Slim {
        this.addRequest('DELETE', args);
        return this;
    }
    getRoutes(): SlimRoutes {
        return this.routes;
    }
    addRoutes(prefix: string, router: Slim): Slim {
        const newRoutes = router.getRoutes();

        for (let method in newRoutes) {
            for (let url in newRoutes[method]) {
                const path = prefix + url;
                this.routes[method][path] = newRoutes[method][url];
            }
        }

        return this;
    }
    static serveStatic(dirPath: string, indexFile?: boolean): HandlerFunction {
        return (req, res, next) => {
            const resolvedBase = resolvePath(dirPath);
            let safeSuffix = normalizePath(req.url).replace(/^(\.\.[\/\\])+/, '');
            let fileLoc = joinPath(resolvedBase, safeSuffix);

            exists(fileLoc, (fileExists: boolean) => {
                if (fileExists) {
                    fileStat(fileLoc, (err, stats) => {
                        if (err) {
                            // handle
                        }

                        if (indexFile && stats.isDirectory()) {
                            fileLoc += 'index.html';
                            safeSuffix = 'index.html';
                        }

                        readFile(fileLoc, (err, data) => {
                            if (err) {
                                next();
                            } else {
                                const fileData = data.toString();
                                const fileExtension = safeSuffix.split('.').pop();
                                const contentType: string = EXT_CONTENT_TYPE[fileExtension];

                                if (contentType) {
                                    res
                                        .writeHead(200, { 'Content-Type': contentType })
                                        .end(fileData);
                                } else {
                                    res.end(fileData);
                                }
                            }
                        });
                    });
                } else {
                    next();
                }
            });
        }
    }
    use(handler: HandlerFunction): Slim {
        this.middleware.push(handler);
        return this;
    }
    static createRouter(log?: boolean): Slim {
        return new Slim(log);
    }
    private parseQueryString(url: string): object {
        const values = url.split('?');
        const queryObj: { [index: string]: string } = {};

        for (let value of values) {
            const pieces: string[] = value.split('=');

            if (pieces && pieces.length == 2) {
                queryObj[pieces[0]] = pieces[1];
            }
        }

        return queryObj;
    }
    private parseBodyJSON(request: SlimRequest): Promise<object> {
        return new Promise((resolve: any, reject: any) => {
            let body = '';

            request.on('data', (data: string) => {
                body += data;

                if (body.length > 1e6) {
                    reject('Too much data in request body');
                }
            });

            request.on('end', () => {
                if (body) {
                    try {
                        const payload = JSON.parse(Object.keys(parseBody(body))[0]);
                        resolve(payload);
                    } catch (e) {
                        reject('Error: Invalid JSON in request body');
                    }
                } else {
                    resolve({});
                }
            });
        })
    }
    private handleRequest(req: SlimRequest, res: SlimResponse): void {
        const { method, url } = req;
        if (this.log) console.log(`${method} ${url}`);

        const baseUrl = url.split('?')[0];

        this.extendRequest(req);
        this.extendResponse(res);

        let matchedRouteHandlers = null;
        const methodRoutes = this.routes[method];

        if (methodRoutes && methodRoutes[baseUrl]) {
            matchedRouteHandlers = methodRoutes[baseUrl]
        }

        this.runHandlers(req, res, [...this.middleware, ...(matchedRouteHandlers || [])]);

        // res
        //     .writeHead(404, { 'Content-Type': 'application/json' })
        //     .end(JSON.stringify({ success: false, result: `No ${method} route found matching ${baseUrl}` }))
    }
    private runHandlers(req: SlimRequest, res: SlimResponse, handlers: HandlerFunction[]): void {
        if (handlers && handlers.length > 0) {
            const handler = handlers.shift();
            handler(req, res, () => this.runHandlers(req, res, handlers));
        }
    }
    private createNewServer(): Server {
        return createServer((req: SlimRequest, res: SlimResponse) => {
            this.handleRequest(req, res);
        });
    }
    private addRequest(type: string, args: any[]) {
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

        if (path !== undefined && path !== null && handlers.length > 0) {
            this.routes[type][path] = handlers;
        } else {
            throw new Error(`Must specify a path and at least one route handler`);
        }
    }
    private extendResponse(response: SlimResponse): SlimResponse {
        response.json = (json: object, statusCode?: number) => {
            response
                .writeHead(statusCode || 200, { 'Content-Type': 'application/json' })
                .end(JSON.stringify(json))
        };

        return response;
    }
    private extendRequest(request: SlimRequest): SlimRequest {
        request.query = () => this.parseQueryString(request.url);
        request.body = () => this.parseBodyJSON(request);

        return request;
    }
}

module.exports = Slim;
