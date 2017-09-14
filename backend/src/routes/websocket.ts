import {Router, Request, Response, NextFunction} from 'express';
import * as WebSocket from 'ws';

export class WebSocketRouter {
    router: Router;

    /**
     * Initialize the ApiRouter
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
    }

}

const websocketRoutes = new WebSocketRouter();
websocketRoutes.init();

export default websocketRoutes.router;
