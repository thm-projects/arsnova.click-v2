import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as bodyParser from 'body-parser';
import { spawnSync } from 'child_process';
import * as compress from 'compression';
import * as cors from 'cors';

import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';
import 'reflect-metadata';
// These are important and needed before anything else
import 'zone.js/dist/zone-node';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();
const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');
const corsOptions = require('./cors.config.ts');

const cache = { 'arsnova-click-v2-frontend': {} };
const availableLangs = ['en', 'de', 'fr', 'es', 'it'];
const projectGitLocation = {
  'arsnova-click-v2-frontend': path.join(__dirname, 'browser'),
};
const projectBaseLocation = {
  'arsnova-click-v2-frontend': path.join(projectGitLocation['arsnova-click-v2-frontend']),
};
const projectAppLocation = {
  'arsnova-click-v2-frontend': path.join(projectBaseLocation['arsnova-click-v2-frontend']),
};
const i18nFileBaseLocation = {
  'arsnova-click-v2-frontend': path.join(projectBaseLocation['arsnova-click-v2-frontend'], 'assets', 'i18n'),
};

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));
app.use(compress());
app.param('project', (req, res, next, project) => {
  if (!project || !i18nFileBaseLocation[project]) {
    res.status(500).send({ status: 'STATUS:FAILED', data: 'Invalid Project specified', payload: { project } });
  } else {
    req.i18nFileBaseLocation = i18nFileBaseLocation[project];
    req.projectBaseLocation = projectBaseLocation[project];
    req.projectAppLocation = projectAppLocation[project];
    req.projectGitLocation = projectGitLocation[project];
    req.projectCache = project;
    next();
  }
});
app.options('*', cors(corsOptions));

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { RootServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

const fromDir = (startPath, filter) => {
  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);
    return;
  }

  let result = [];

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      result = result.concat(fromDir(filename, filter));
    } else if (filter.test(filename)) {
      result.push(filename);
    }
  }
  return result;
};

const objectPath = (obj, currentPath = '') => {
  let localCurrentPath = currentPath;
  let result = [];

  if (localCurrentPath.length) {
    localCurrentPath = localCurrentPath + '.';
  }
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object') {
        result = result.concat(objectPath(obj[prop], localCurrentPath + prop));
      } else {
        result.push(localCurrentPath + prop);
      }
    }
  }
  return result;
};

const isString = (data) => {
  return typeof data === 'string';
};

const buildKeys = ({ root, dataNode, langRef, langData }) => {

  if (!dataNode) {
    return;
  }

  if (isString(dataNode)) {

    const existingKey = langData.find(elem => elem.key === root);

    if (existingKey) {
      langData.find(elem => elem.key === root).value[langRef] = dataNode;
    } else {
      const value = {};
      value[langRef] = dataNode;
      langData.push({ key: root, value });
    }

  } else {
    Object.keys(dataNode).forEach(key => {
      const rootKey = root ? `${root}.` : '';
      buildKeys({ root: `${rootKey}${key}`, dataNode: dataNode[key], langRef, langData });
    });
  }
};

const createObjectFromKeys = ({ data, result }) => {

  for (const langRef in result) {
    if (result.hasOwnProperty(langRef)) {
      const obj = {};
      data.forEach(elem => {
        const val = elem.value[langRef];
        const objPath = elem.key.split('.');
        objPath.reduce((prevVal, currentVal, index) => {
          if (!prevVal[currentVal]) {
            prevVal[currentVal] = {};
            if (index === objPath.length - 1) {
              prevVal[currentVal] = val;
            }
          }
          return prevVal[currentVal];
        }, obj);

      });
      result[langRef] = { ...result[langRef], ...obj };

    }
  }
};

const getUnusedKeys = (req) => {
  const result = {};
  const fileNames = fromDir(req.projectAppLocation, /\.(ts|html|js)$/);
  const langRefs = req.params.langRef ? [req.params.langRef] : availableLangs;

  for (let i = 0; i < langRefs.length; i++) {
    result[langRefs[i]] = [];
    const i18nFileContent = JSON.parse(fs.readFileSync(path.join(req.i18nFileBaseLocation, `${langRefs[i]}.json`)).toString('UTF-8'));
    const objectPaths = objectPath(i18nFileContent);

    objectPaths.forEach((i18nPath => {
      let matched = false;
      fileNames.forEach(filename => {
        if (matched) {
          return;
        }
        const fileContent = fs.readFileSync(filename).toString('UTF-8');
        matched = fileContent.indexOf(i18nPath) > -1;
      });
      if (!matched) {
        result[langRefs[i]].push(i18nPath);
      }
    }));
  }

  return result;
};

const getBranch = (req) => {
  const command = `git branch 2> /dev/null | sed -e '/^[^*]/d' -e "s/* \\(.*\\)/\\1/"`;
  const child = spawnSync('/bin/sh', [`-c`, command], { cwd: req.projectGitLocation });
  return child.stdout.toString().replace('\n', '');
};

app.engine('html', ngExpressEngine({
  bootstrap: RootServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
  ],
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// TODO: implement data requests securely
app.get('/api/v1/plugin/i18nator/:project/langFile', async (req, res) => {
  const payload = { langData: {}, unused: {}, branch: {} };

  if (!cache[req.projectCache].langData) {
    const langData = [];
    availableLangs.forEach((langRef, index) => {
      buildKeys({
        root: '',
        dataNode: JSON.parse(fs.readFileSync(path.join(req.i18nFileBaseLocation, `${langRef}.json`)).toString('UTF-8')),
        langRef,
        langData,
      });
    });
    cache[req.projectCache].langData = langData;
  }
  payload.langData = cache[req.projectCache].langData;

  if (!cache[req.projectCache].unused) {
    cache[req.projectCache].unused = getUnusedKeys(req);
  }
  payload.unused = cache[req.projectCache].unused;

  if (!cache[req.projectCache].branch) {
    cache[req.projectCache].branch = getBranch(req);
  }
  payload.branch = cache[req.projectCache].branch;

  res.send({ status: 'STATUS:SUCCESSFUL', payload });
});
app.post('/api/v1/plugin/i18nator/:project/updateLang', async (req, res) => {
  if (!req.body.data) {
    res.status(500).send({ status: 'STATUS:FAILED', data: 'Invalid Data', payload: { body: req.body } });
    return;
  }

  const result = { en: {}, de: {}, es: {}, fr: {}, it: {} };
  const langKeys = Object.keys(result);
  createObjectFromKeys({ data: req.body.data, result });

  cache[req.projectCache].langData = req.body.data;

  langKeys.forEach((langRef, index) => {
    const fileContent = result[langRef];
    const fileLocation = path.join(req.i18nFileBaseLocation, `${langRef}.json`);
    const exists = fs.existsSync(fileLocation);
    if (!exists) {
      res.status(404).send({ status: 'STATUS:FAILED', data: 'File not found', payload: { fileLocation } });
      return;
    }
    fs.writeFileSync(fileLocation, JSON.stringify(fileContent));
    if (index === langKeys.length - 1) {
      res.send({ status: 'STATUS:SUCCESSFUL' });
    }
  });
});
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);

  Object.keys(cache).forEach(projectName => {
    console.log(``);
    console.log(`------- Building cache for '${projectName}' -------`);

    console.log(`* Fetching language data`);
    const langDataStart = new Date().getTime();
    const langData = [];
    availableLangs.forEach((langRef, index) => {
      buildKeys({
        root: '',
        dataNode: JSON.parse(fs.readFileSync(path.join(i18nFileBaseLocation[projectName], `${langRef}.json`)).toString('UTF-8')),
        langRef,
        langData,
      });
    });
    cache[projectName].langData = langData;
    const langDataEnd = new Date().getTime();
    console.log(`-- Done. Took ${langDataEnd - langDataStart}ms`);

    console.log(`* Fetching unused keys`);
    const unusedKeysStart = new Date().getTime();
    cache[projectName].unused = getUnusedKeys({
      params: {},
      projectAppLocation: projectAppLocation[projectName],
      i18nFileBaseLocation: i18nFileBaseLocation[projectName],
    });
    const unusedKeysEnd = new Date().getTime();
    console.log(`-- Done. Took ${unusedKeysEnd - unusedKeysStart}ms`);

    console.log(`* Fetching active git branch`);
    const gitBranchStart = new Date().getTime();
    cache[projectName].branch = getBranch({
      projectGitLocation: projectGitLocation[projectName],
    });
    const gitBranchEnd = new Date().getTime();
    console.log(`-- Done. Took ${gitBranchEnd - gitBranchStart}ms`);

  });
  console.log(``);
  console.log(`Cache built successfully`);
});
