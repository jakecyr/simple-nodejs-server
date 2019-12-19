import { HandlerFunction } from './handler-function.type';

export interface SlimRoutes {
    [index: string]: { [index: string]: HandlerFunction[] }
}
