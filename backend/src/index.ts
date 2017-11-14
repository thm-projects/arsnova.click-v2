import App from './App';

import * as debug from 'debug';
import * as WebSocket from 'ws';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import {WebSocketRouter} from './routes/websocket';
import {Server} from 'http';
import * as process from 'process';
import * as slimerjs from 'slimerjs';
import {ChildProcess, spawn} from 'child_process';
import {themes} from './themes/availableThemes';
import {ITheme} from './interfaces/common.interfaces';
import {DbDao} from './db/DbDao';
import {staticStatistics} from './statistics';
import {createDefaultPaths} from './app_bootstrap';

debug('arsnova.click: ts-express:server');

createDefaultPaths();

const privateServerConfig = require('../settings.json');

const port: string | number | boolean = normalizePort(staticStatistics.port);
App.set('port', port);

const server: Server = http.createServer(App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('close', onClose);

const languages = ['en', 'de', 'fr', 'it', 'es'];
const params: any = [path.join(__dirname, 'phantomDriver.js')];
const themePreviewEndpoint = `${process.env.npm_package_config_themePreviewHost}/preview`;
themes.forEach((theme: ITheme) => {
  languages.forEach((languageKey) => {
    params.push(`${themePreviewEndpoint}/${theme.id}/${languageKey}`);
  });
});
const command: ChildProcess = spawn(slimerjs.path, params);
command.stdout.on('data', (data) => {
  debug(`arsnova.click:phantomjs (stdout): ${data.toString()}`);
});
command.stderr.on('data', (data) => {
  debug(`arsnova.click:phantomjs (stderr): ${data.toString()}`);
});
command.on('exit', () => {
  debug(`arsnova.click:phantomjs (exit): All preview images have been generated`);
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
  DbDao.closeConnections();

  WebSocketRouter.wss.close();
}
