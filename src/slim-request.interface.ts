import { IncomingMessage } from 'http';

export interface QueryObject {
    [index: string]: any;
}

export interface BodyObject {
    [index: string]: any;
}

export interface SlimRequest extends IncomingMessage {
    query: () => QueryObject;
    body: () => Promise<BodyObject>;
    url: string;
    method: string;
}
