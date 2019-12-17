import { SimpleRequest } from './simple-request.interface';
import { SimpleResponse } from './simple-response.interface';

export type HandlerFunction = (request: SimpleRequest, response: SimpleResponse, next?: Function) => void;
