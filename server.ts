import { enableProdMode } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
// Express Engine
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as bodyParser from 'body-parser';
import * as compress from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import { readFileSync } from 'fs';
import * as path from 'path';

import 'reflect-metadata';
// These are important and needed before anything else
import 'zone.js/dist/zone-node';

Error.stackTraceLimit = Infinity;

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();
const PORT = process.env.PORT || 4000;
const DIST_FOLDER = path.join(process.cwd());
const corsOptions = require('./cors.config.ts');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
}));
app.use(cors(corsOptions));
app.use(compress());
app.options('*', cors(corsOptions));

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { RootServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

const template = readFileSync(path.join(DIST_FOLDER, 'browser', 'index.html')).toString();

app.engine('html', (_, options, callback) => {
  renderModuleFactory(RootServerModuleNgFactory, {
    // Our index.html
    document: template,
    url: options.req.url, // DI so that we can get lazy-loading to work differently (since we need it to just instantly render it)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP),
    ],
  }).then(html => {
    callback(null, html);
  });
});


app.set('view engine', 'html');
app.set('views', path.join(DIST_FOLDER, 'browser'));

app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(path.join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
