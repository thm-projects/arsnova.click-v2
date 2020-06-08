import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import * as compression from 'compression';
import * as cookieparser from 'cookie-parser';
import * as express from 'express';
import { Express } from 'express';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import 'zone.js/dist/zone-node';
import { environment } from './environments/environment';
import { AppServerModule } from './main.server';

require('source-map-support').install();

// The Express app is exported so that it can be used by serverless Functions.
export function app(): Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/frontend/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index.html';
  const themeHashMap = JSON.parse(readFileSync(join(distFolder, 'assets/theme-hashes.json'), {encoding: 'UTF-8'}));

  // gzip
  server.use(compression());
  // cookies
  server.use(cookieparser());

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.disable('x-powered-by');

  // Example Express Rest API endpoints
  // app.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('**/*.*', express.static(distFolder, {
    maxAge: '1y',
  }), (req, res, next) => {
    if (process.env.NODE_ENV !== 'development' || req.url.endsWith('.css')) {
      next();
      return;
    }

    console.log('Rewriting static request', 'https://arsnova.click' + req.url);
    res.redirect('https://arsnova.click' + req.url);
  });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    const reqUrlMatch = req.url.match(/\/preview\/([a-z\-A-Z]*)\/.*/);
    const theme = (reqUrlMatch ? reqUrlMatch[1] : req.cookies.theme) ?? environment.defaultTheme;
    const hash = themeHashMap.find(value => value.theme === theme)?.hash ?? themeHashMap.find(value => value.theme === environment.defaultTheme);
    const href = `theme-${theme}${hash ? '-' : ''}${hash}.css`;
    const indexHtmlContent = readFileSync(join(distFolder, indexHtml), {encoding: 'UTF-8'});
    const updatedIndexHtml = indexHtmlContent.replace(/theme-default.css/g, href);

    res.render(indexHtml, {
      req,
      res,
      document: updatedIndexHtml,
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: req.baseUrl,
        }, {
          provide: REQUEST,
          useValue: req,
        },
      ],
    });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './main.server';
