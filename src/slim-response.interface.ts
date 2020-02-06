import { ServerResponse } from 'http';

export interface SlimResponse extends ServerResponse {
    cookie: (name: string, value: string, options?: object) => void;
    json: (json: object, statusCode?: number) => void;
    redirect: (url: string) => void;
    writeHead: any;
}
