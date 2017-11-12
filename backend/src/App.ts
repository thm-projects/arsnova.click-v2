import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as busboy from 'connect-busboy';
import * as i18n from 'i18n';
import * as path from 'path';

import {NextFunction, Router, Response, Request} from 'express';
import options from './cors.config';
import {dynamicStatistics, staticStatistics} from './statistics';

import ApiRouter from './routes/api';
import LibRouter from './routes/lib';
import LegacyApiRouter from './routes/legacy-api';
import QuizRouter from './routes/quiz';
import LobbyRouter from './routes/lobby';
import NicksRouter from './routes/nicks';
import ThemesRouter from './routes/themes';
import MemberRouter from './routes/member';

i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['en', 'de', 'it', 'es', 'fr'],

  // fall back from Dutch to German
  fallbacks: {'nl': 'de'},

  // where to store json files - defaults to './locales' relative to modules directory
  directory: path.join(__dirname, '../i18n'),

  // watch for changes in json files to reload locale on updates - defaults to false
  autoReload: true,

  // whether to write new locale information to disk - defaults to true
  updateFiles: false,

  // sync locale information accros all files - defaults to false
  syncFiles: false,

  // what to use as the indentation unit - defaults to "\t"
  indent: '\t',

  // setting extension of json files - defaults to '.json' (you might want to set this to '.js' according to webtranslateit)
  extension: '.json',

  // setting prefix of json files name - default to none ''
  // (in case you use different locale files naming scheme (webapp-en.json), rather then just en.json)
  prefix: '',

  // enable object notation
  objectNotation: true,

  // setting of log level DEBUG - default to require('debug')('i18n:debug')
  logDebugFn: require('debug')('i18n:debug'),

  // setting of log level WARN - default to require('debug')('i18n:warn')
  logWarnFn: function (msg) {
    console.log('warn', msg);
  },

  // setting of log level ERROR - default to require('debug')('i18n:error')
  logErrorFn: function (msg) {
    console.log('error', msg);
  },

  // object or [obj1, obj2] to bind the i18n api and current locale to - defaults to null
  register: global,

  // hash to specify different aliases for i18n's internal methods to apply on the request/response objects (method -> alias).
  // note that this will *not* overwrite existing properties with the same name
  api: {
    '__': 't',  // now req.__ becomes req.t
    '__n': 'tn' // and req.__n can be called as req.tn
  }
});

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  // Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(busboy());
    this.express.use(bodyParser.json());
    this.express.use(i18n.init);
    this.express.use(bodyParser.urlencoded({extended: false}));
    this.express.use(cors(options));
    this.express.options('*', cors(options));
  }

  // Configure API endpoints.
  private routes(): void {
    const router: Router = express.Router();
    router.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.json(Object.assign({}, staticStatistics, dynamicStatistics()));
    });
    this.express.use('/', router);
    this.express.use('/lib', LibRouter);
    this.express.use('/api', LegacyApiRouter);
    this.express.use('/api/v1', ApiRouter);
    this.express.use('/api/v1/quiz', QuizRouter);
    this.express.use('/api/v1/member', MemberRouter);
    this.express.use('/api/v1/lobby', LobbyRouter);
    this.express.use('/api/v1/nicks', NicksRouter);
    this.express.use('/api/v1/themes', ThemesRouter);
  }

}

export default new App().express;
