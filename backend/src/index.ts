import App from './App';

import * as debug from 'debug';
import * as WebSocket from 'ws';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as pnFs from 'pn/fs';
import * as svg2png from 'svg2png';
import * as imagemin from 'imagemin';
import * as imageminPngquant from 'imagemin-pngquant';
import {WebSocketRouter} from './routes/websocket';
import {Server} from 'https';
import * as process from 'process';
import * as phantomjs from 'phantomjs-prebuilt';
import {ChildProcess, spawn} from 'child_process';
import {themes} from './themes/availableThemes';
import {ITheme} from './interfaces/common.interfaces';
import {DatabaseTypes, DbDao} from './db/DbDao';

debug('arsnova.click: ts-express:server');
const cert = fs.readFileSync(path.join(__dirname, '../certs/server.crt'));
const key = fs.readFileSync(path.join(__dirname, '../certs/server.key'));

const port: string | number | boolean = normalizePort(process.env.PORT || 3000);
App.set('port', port);

const server: Server = https.createServer({key: key, cert: cert}, App);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('close', onClose);

const languages = ['en', 'de', 'fr', 'it', 'es'];
const params: any = [path.join(__dirname, 'phantomDriver.js')];
const themePreviewEndpoint = 'http://localhost:4200/preview';
themes.forEach((theme: ITheme) => {
  languages.forEach((languageKey) => {
    pnFs.readFile(path.join(__dirname, `../images/favicons/favicon.svg`))
        .then(svg2png)
        .then(buffer => fs.writeFile(path.join(__dirname, `../images/favicons/favicon_${theme.id}.png`), buffer, (err => console.log('err in writing favicon', err))))
        .catch(e => console.error('catched while generating favicons', e));
    params.push(`${themePreviewEndpoint}/${theme.id}/${languageKey}`);
  });
});
const command: ChildProcess = spawn(phantomjs.path, params);
command.stdout.on('data', (data) => {
  debug(`phantomjs (stdout): ${data.toString()}`);
});
command.stderr.on('data', (data) => {
  console.log(`phantomjs (stderr): ${data.toString()}`);
});
command.on('exit', () => {
  console.log(`phantomjs (exit): All preview images have been generated`);

  imagemin([path.join(__dirname, '../images/**/*.{png}')], path.join(__dirname, '../images'), {
    plugins: [
      imageminPngquant({quality: '65-80'})
    ]
  }).then(files => {
    files.forEach(file => fs.writeFile(path.join(__dirname, file.path), file.data, (err) => console.log('error while minifiing pngs', err)));
  });
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
