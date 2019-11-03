import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

import derivates from '../imageDerivates';
import themeData from '../themeData';
import process from 'process';
import minimist from 'minimist';
import child_process from 'child_process';
import {default as imagemin} from 'imagemin';
import {default as imageminPngquant} from 'imagemin-pngquant';

const argv = minimist(process.argv.slice(2));

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

  async generateFrontendPreview(host, isRoot) {
    const params = [];
    const themePreviewEndpoint = `${host}/preview`;
    Object.keys(themeData).forEach((theme) => {
      languages.forEach((languageKey) => {
        params.push(`${themePreviewEndpoint}/${theme}/${languageKey}`);
      });
    });

    const chromeDriver = child_process.spawn(`node`, [
      path.join('puppeteer.js'), `--urls=${JSON.stringify(params)}`, '--format=png', `${isRoot ? '--root=true' : ''}`
    ]);

    chromeDriver.stdout.on('data', (data) => {
      console.log(`PreviewGenerator: ${data.toString().replace('\n', '')}`);
    });
    chromeDriver.stderr.on('data', (data) => {
      console.log(`PreviewGenerator (stderr): ${data.toString().replace('\n', '')}`);
    });
    chromeDriver.on('exit', (code, signal) => {
      console.log(`PreviewGenerator: Done. Exit ${!!code ? 'code' : 'signal'} was: ${!!code ? code : signal}`);
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

      await this.asyncForEach(derivates.logo, async (derivate) => {
        const splittedDerivate = derivate.split('x');
        const targetLogo = path.join(this.pathToDestination, `${themeName}`, `logo_s${derivate}.png`);
        const size = {
          width: parseInt(splittedDerivate[0], 10),
          height: parseInt(splittedDerivate[1], 10),
          roundX: Math.round((splittedDerivate[0] / (Math.PI * 2))),
          roundY: Math.round((splittedDerivate[1] / (Math.PI * 2)))
        };
        const roundedCorners = Buffer.from(
          `<svg><rect x="0" y="0" width="${size.width}" height="${size.height}" rx="${size.roundX}" ry="${size.roundY}"></rect></svg>`
        );

        const buffer = await sharp(source)
        .resize(size.width, size.height)
        .overlayWith(roundedCorners, {cutout: true})
        .flatten({background: theme})
        .sharpen()
        .png()
        .toBuffer();

        const minifiedBuffer = await imagemin.buffer(buffer, {
          plugins: [imageminPngquant({quality: '65-80'})]
        });

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
        generateImages.generateFrontendPreview(argv.host, argv.root);
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
