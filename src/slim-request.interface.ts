import { IncomingMessage } from 'http';

export interface SlimRequest extends IncomingMessage {
    query: () => object;
    body: () => Promise<object>;
    url: string;
    method: string;
}
