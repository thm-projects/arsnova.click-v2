import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {cpus, freemem, loadavg, totalmem, uptime} from "os";
import * as cors from "cors";

import ApiRouter from './routes/api';
import options from "./cors.config";

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: express.Application;

    //Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors(options));
        this.express.options("*", cors(options));
    }

    // Configure API endpoints.
    private routes(): void {
        let router = express.Router();
        router.get('/', (req, res, next) => {
            res.json({
                uptime: `${uptime()} seconds`,
                loadavg: loadavg(),
                freemem: freemem(),
                totalmem: totalmem(),
                cpus: cpus(),
                connectedUsers: Math.round(Math.random()*100),
                activeQuizzes: Math.round(Math.random()*100),
                persistedQuizzes: Math.round(Math.random()*100)
            });
        });
        this.express.use('/', router);
        this.express.use('/api/v1', ApiRouter);
        //this.express.use('/websocket', WebSocketRouter);
    }

}

export default new App().express;