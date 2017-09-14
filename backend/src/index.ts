
import App from './App';

import * as debug from 'debug';
import * as WebSocket from 'ws';
import * as https from "https";
import * as fs from "fs";
import * as path from "path";

debug('ts-express:server');
const cert = fs.readFileSync(path.join(__dirname, '../certs/server.crt'));
const key = fs.readFileSync(path.join(__dirname, '../certs/server.key'));

const port = normalizePort(process.env.PORT || 3000);
App.set('port', port);

const server = https.createServer({key: key, cert: cert}, App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const wss = new WebSocket.Server({ server });
//initialize the WebSocket server instance
wss.on('connection', (ws: WebSocket) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });
    //send immediatly a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server');
});

function normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch(error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}