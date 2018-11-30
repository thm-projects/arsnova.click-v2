import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

import derivates from '../imageDerivates';
import themeData from '../themeData';
import process from 'process';
import child_process from 'child_process';
import minimist from 'minimist';
import {default as chromeLauncher} from 'chrome-launcher';

const argv = minimist(process.argv.slice(2));

const themes = [
  'theme-Material',
  'theme-Material-hope',
  'theme-Material-blue',
  'theme-arsnova-dot-click-contrast',
  'theme-blackbeauty',
  'theme-elegant',
  'theme-decent-blue',
  'theme-spiritual-purple',
  'theme-GreyBlue-Lime'
];

const languages = ['en', 'de', 'fr', 'it', 'es'];

const __dirname = path.resolve();

class GenerateImages {

  constructor() {
    this.pathToAssets = path.join(__dirname, '..');
  }

  generateDirectories() {
    this.pathToDestination = path.join(this.pathToAssets, 'images', 'theme');

    if (!fs.existsSync(this.pathToDestination)) {
      fs.mkdirSync(this.pathToDestination);
    }
    Object.keys(themeData).forEach((themeName) => {
      const pathToThemeDestination = path.join(this.pathToDestination, themeName);
      if (!fs.existsSync(pathToThemeDestination)) {
        fs.mkdirSync(pathToThemeDestination);
      }
    });

  }

  help() {
    console.log('----------------------');
    console.log('Available commands:');
    console.log('help - Show this help');
    console.log('all(host: string) - Will call all methods below');
    console.log('generateFrontendPreview(host: string) - Adds the preview screenshots for the frontend. The frontend and the backend must be running!');
    console.log('generateLogoImages() - Generates the logo images (used as favicon and manifest files)');
    console.log('----------------------');
  }

  all(host) {
    console.log('----------------------');
    console.log(`generateLogoImages: Started with host: ${host}`);
    this.generateFrontendPreview(host);
    console.log('----------------------');
    console.log(`generateLogoImages: Started`);
    this.generateLogoImages();
    console.log('----------------------');
  }

  async generateFrontendPreview(host) {
    const CHROME_BIN = process.env.CHROME_BIN;
    const flags = ['--headless', '--hide-scrollbars', '--no-sandbox', '--remote-debugging-port=9222', '--disable-gpu', '--user-data-dir=remote-profile'];
    const params = [];
    const themePreviewEndpoint = `${host}/preview`;
    themes.forEach((theme) => {
      languages.forEach((languageKey) => {
        params.push(`${themePreviewEndpoint}/${theme}/${languageKey}`);
      });
    });

    if (await this.isRunning(CHROME_BIN, CHROME_BIN, CHROME_BIN)) {
      throw new Error('Chrome instance already running');
    }

    const chromeInstance = await chromeLauncher.launch({
      startingUrl: 'https://google.com',
      chromeFlags: flags,
      chromePath: CHROME_BIN,
      port: 9222
    });
    console.log(`Chrome debugging port running on ${chromeInstance.port}`);

    console.log('chrome stuff', CHROME_BIN, themePreviewEndpoint, params);
    // const chromeInstance = child_process.spawnSync(CHROME_BIN, flags);
    const chromeDriver = child_process.spawn(`node`, [
      path.join('ChromeDriver.js'), `--urls=${JSON.stringify(params)}`
    ]);

    chromeDriver.stdout.on('data', (data) => {
      console.log(`ChromeDriver: ${data.toString().replace('\n', '')}`);
    });
    chromeDriver.stderr.on('data', (data) => {
      console.log(`ChromeDriver (stderr): ${data.toString().replace('\n', '')}`);
    });
    chromeDriver.on('exit', (code, signal) => {
      console.log(`ChromeDriver: Done. Exit ${!!code ? 'code' : 'signal'} was: ${!!code ? code : signal}`);
      chromeInstance.kill();
    });

  }

  async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  generateLogoImages() {
    const source = path.join(this.pathToAssets, 'images', 'logo_transparent.png');

    this.asyncForEach(Object.keys(themeData), async (themeName) => {
      const theme = themeData[themeName].quizNameRowStyle.bg;

      await this.asyncForEach(derivates, async (derivate) => {
        const splittedDerivate = derivate.split('x');
        const targetLogo = path.join(this.pathToDestination, `${themeName}`, `logo_s${derivate}.png`);
        const size = {
          width: parseInt(splittedDerivate[0], 10),
          height: parseInt(splittedDerivate[1], 10),
          roundX: Math.round((splittedDerivate[0] / Math.PI)),
          roundY: Math.round((splittedDerivate[1] / Math.PI))
        };

        const minifiedBuffer = await sharp(source)
        .resize(size.width, size.height)
        .flatten({background: theme})
        .sharpen()
        .png()
        .toBuffer();
        fs.writeFileSync(targetLogo, minifiedBuffer, 'binary');
        console.log(`Writing file '${targetLogo}'`);
        console.log(`Icon with size of ${derivate}px generated for theme ${themeName}`);
      });
    });
  }

  isRunning(win, mac, linux) {
    return new Promise(resolve => {
      const plat = process.platform;
      const cmd = plat === 'win32' ? 'tasklist' : (plat === 'darwin' ? 'ps -ax | grep ' + mac : (plat === 'linux' ? 'ps -A | grep ' + linux : ''));
      const proc = plat === 'win32' ? win : (plat === 'darwin' ? mac : (plat === 'linux' ? linux : ''));
      if (cmd === '' || proc === '') {
        resolve(false);
        return;
      }
      child_process.exec(cmd, (err, stdout) => {
        if (err && err.code === 1) {
          resolve(false);
        } else if (!stdout || !stdout.length || stdout.toLowerCase().indexOf(proc.toLowerCase()) === -1) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}

const generateImages = new GenerateImages();

const init = () => {
  if (process.argv.length < 2) {
    generateImages.help();
  } else {
    if (argv.baseDir) {
      generateImages.pathToAssets = argv.baseDir;
    }

    generateImages.generateDirectories();

    if (!argv.command) {
      console.log(`> No command specified: ${JSON.stringify(argv)}`);
      generateImages.help();
      return;
    }
    if (!generateImages[argv.command]) {
      console.log(`> Command ${argv.command} not found!`);
      generateImages.help();
      return;
    }

    switch (argv.command) {
      case 'all':
        if (!argv.host) {
          console.log(`> Command ${argv.command} requires missing parameter!`);
          generateImages.help();
          break;
        }
        generateImages.all(argv.host);
        break;
      case 'generateFrontendPreview':
        if (!argv.host) {
          console.log(`> Command ${argv.command} requires missing parameter!`);
          generateImages.help();
          break;
        }
        generateImages.generateFrontendPreview(argv.host);
        break;
      case 'generateLogoImages':
        generateImages.generateLogoImages();
        break;
      default:
        throw new Error(`No command handling specified for ${argv.command}`);
    }
  }
};

init();