
import { createServer } from 'http';
import { parse as parseBody } from 'querystring';

import { SimpleRequest } from './simple-request.interface';
import { SimpleResponse } from './simple-response.interface';
import { HandlerFunction } from './handler-function.type';
import { SimpleRoutes } from './simple-routes.interface';

class Simple {

    private routes: SimpleRoutes = {
        GET: {},
        POST: {},
        PUT: {},
        DELETE: {},
    };

    constructor(private log: boolean) { }

    listen(port: number, host: string, onListen: () => void) {
        this.createNewServer().listen(port, host, null, onListen);
    }
    request(type: string, ...args: any[]) {
        this.addRequest(type, [...args]);
        return this;
    }
    get(...args: any[]) {
        this.addRequest('GET', args);
        return this;
    }
    post(...args: any[]) {
        this.addRequest('POST', args);
        return this;
    }
    put(...args: any[]) {
        this.addRequest('PUT', args);
        return this;
    }
    delete(...args: any[]) {
        this.addRequest('DELETE', args);
        return this;
    }
    private parseQueryString(url: string): object {
        const values = url.split('?');
        const queryObj: { [index: string]: string } = {};

        for (let value of values) {
            const pieces: any[] = value.split('=');

            if (pieces && pieces.length == 2) {
                queryObj[pieces[0]] = pieces[1];
            }
        }

        return queryObj;
    }
    private parseBodyJSON(request: SimpleRequest): Promise<object> {
        return new Promise((resolve: any, reject: any) => {
            let body = '';

            request.on('data', (data: string) => {
                body += data;

                if (body.length > 1e6) {
                    reject('Too much data in request body');
                }
            });

            request.on('end', () => {
                try {
                    const payload = JSON.parse(Object.keys(parseBody(body))[0]);
                    resolve(payload);
                } catch (e) {
                    reject(e);
                }
            });
        })
    }
    private handleRequest(req: SimpleRequest, res: SimpleResponse): void {
        const { method, url } = req;
        if (this.log) console.log(`${method} ${url}`);

        const baseUrl = url.split('?')[0];

        this.extendRequest(req);
        this.extendResponse(res);

        const methodRoutes = this.routes[method];

        if (methodRoutes && methodRoutes[baseUrl]) {
            this.runHandlers(req, res, [...methodRoutes[baseUrl]]);
        } else {
            res
                .writeHead(404, { 'Content-Type': 'application/json' })
                .end(JSON.stringify({ success: false, result: `No ${method} route found matching ${baseUrl}` }))
        }
    }
    private runHandlers(req: SimpleRequest, res: SimpleResponse, handlers: HandlerFunction[]) {
        if (handlers && handlers.length > 0) {
            const handler = handlers.shift();

            if (handlers.length == 0) {
                handler(req, res);
            } else {
                handler(req, res, () => this.runHandlers(req, res, handlers));
            }
        }
    }
    private createNewServer() {
        return createServer((req: SimpleRequest, res: SimpleResponse) => {
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

        if (path && handlers.length > 0) {
            this.routes[type][path] = handlers;
        } else {
            throw new Error(`Must specify a path and at least one route handler`);
        }
    }
    private extendResponse(response: SimpleResponse) {
        response.json = (json: object, statusCode: number = 200) => {
            response
                .writeHead(statusCode, { 'Content-Type': 'application/json' })
                .end(JSON.stringify(json))
        };

        return response;
    }
    private extendRequest(request: SimpleRequest) {
        request.query = () => this.parseQueryString(request.url);
        request.body = () => this.parseBodyJSON(request);
    }
}

module.exports = Simple;
