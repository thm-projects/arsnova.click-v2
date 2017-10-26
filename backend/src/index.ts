import App from './App';

import * as debug from 'debug';
import * as WebSocket from 'ws';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import {WebSocketRouter} from './routes/websocket';
import {Server} from 'https';
import * as process from 'process';
import * as phantomjs from 'phantomjs-prebuilt';
import {ChildProcess, spawn} from 'child_process';
import {themes} from './themes/availableThemes';
import {ITheme} from './interfaces/common.interfaces';
import {DatabaseTypes, DbDao} from './db/DbDao';

debug('arsnova.click: ts-express:server');
const cert: any = fs.readFileSync(path.join(__dirname, '../certs/server.crt'));
const key: any = fs.readFileSync(path.join(__dirname, '../certs/server.key'));

const port: string | number | boolean = normalizePort(process.env.PORT || 3000);
App.set('port', port);

const server: Server = https.createServer({key: key, cert: cert}, App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('close', onClose);

const languages: any = {'en': 'en'};
const params: any = [path.join(__dirname, '../theme_preview/phantomDriver.js')];
const themePreviewEndpoint = 'http://localhost:4200/preview';
themes.forEach((theme: ITheme) => {
  for (const languageKey in languages) {
    if (languages.hasOwnProperty(languageKey)) {
      params.push(`${themePreviewEndpoint}/${theme.id}/${languageKey}`);
    }
  }
});
const command: ChildProcess = spawn(phantomjs.path, params);
command.stdout.on('data', (data) => {
  debug(`phantomjs (stdout): ${data.toString()}`);
});
command.stderr.on('data', (data) => {
  debug(`phantomjs (stderr): ${data.toString()}`);
});
command.on('exit', () => {
  debug(`phantomjs (exit): All preview images have been generated`);
});


function normalizePort(val: number | string): number | string | boolean {
  const portCheck: number = (typeof val === 'string') ? parseInt(val, 10) : val;
  if (isNaN(portCheck)) {
    return val;
  } else if (portCheck >= 0) {
    return portCheck;
  } else {
    return false;
  }
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind: string = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
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
  const addr: { port: number; family: string; address: string; } = server.address();
  const bind: string = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);

  WebSocketRouter.wss = new WebSocket.Server({server});
}

function onClose(): void {
  DbDao.closeConnection(DatabaseTypes.quiz);
  DbDao.closeConnection(DatabaseTypes.assets);

  WebSocketRouter.wss.close();
}
