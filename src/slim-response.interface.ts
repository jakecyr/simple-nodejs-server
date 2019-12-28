import { ServerResponse } from 'http';

export interface SlimResponse extends ServerResponse {
    json: (json: object, statusCode?: number) => void;
    cookie: (name: string, value: string, options?:object) => void;
    writeHead: any;
}
