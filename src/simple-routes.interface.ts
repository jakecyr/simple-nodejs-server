import { HandlerFunction } from './handler-function.type';

export interface SimpleRoutes {
    [index: string]: { [index: string]: HandlerFunction[] }
}
