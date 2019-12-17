import { IncomingMessage } from 'http';

export interface SimpleRequest extends IncomingMessage {
    query: () => object;
    url: string;
    method: string;
}
