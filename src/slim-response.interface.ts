import { ServerResponse } from 'http';

export interface SlimResponse extends ServerResponse {
    json: (json: object, statusCode?: number) => void;
    writeHead: any;
}
