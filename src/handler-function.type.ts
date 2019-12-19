import { SlimRequest } from './slim-request.interface';
import { SlimResponse } from './slim-response.interface';

export type HandlerFunction = (request: SlimRequest, response: SlimResponse, next?: Function) => void;
