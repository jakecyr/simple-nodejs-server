import { ServerResponse } from 'http';

export interface SimpleResponse extends ServerResponse {
    json: (json: object, statusCode?: number) => void;
    writeHead: any;
}
