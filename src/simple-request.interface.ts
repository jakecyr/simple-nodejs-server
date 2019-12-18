import { IncomingMessage } from 'http';

export interface SimpleRequest extends IncomingMessage {
    query: () => object;
    body: () => Promise<object>;
    url: string;
    method: string;
}
