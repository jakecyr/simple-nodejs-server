import { IncomingMessage } from 'http';

export interface SlimRequest extends IncomingMessage {
    query: <Query>() => Query;
    body: <Body>() => Promise<Body>;
    url: string;
    method: string;
}
