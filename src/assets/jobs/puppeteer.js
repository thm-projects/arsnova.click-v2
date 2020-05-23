const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const sharp = require("sharp");

const urls = argv.urls ? JSON.parse(argv.urls) : [argv.url || 'https://www.google.com'];
const format = argv.format === 'png' ? 'png' : 'jpeg';
const viewportWidth = argv.viewportWidth || 1024;
const viewportHeight = argv.viewportHeight || 576;
const delay = argv.delay || 850;
const params = argv.root ? {args: ['--no-sandbox', '--disable-setuid-sandbox'], executablePath: process.env.CHROMIUM_PATH} : {};
const derivates = require('../imageDerivates').frontendPreview;

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

(async () => {
  const browser = await puppeteer.launch(params);
  const page = await browser.newPage();
  await page.setViewport({width: viewportWidth, height: viewportHeight});
  await page.setJavaScriptEnabled(false);

  const host = /localhost/.test(urls[0]) ?
    'localhost' : /staging.arsnova.click/.test(urls[0]) ?
      'staging.arsnova.click' : /beta.arsnova.click/.test(urls[0]) ?
        'beta.arsnova.click' : /arsnova.click/.test(urls[0]) ?
          'arsnova.click' : '';

  await page.setCookie({
    'name': 'cookieconsent_status',
    'value': 'dismiss',
    'domain': host,
    'path': '/',
    'expires': (new Date()).getTime() + (1000 * 60 * 60)
  });

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    await page.goto(url, {waitUntil: 'networkidle2'});
    await new Promise(resolve => setTimeout(resolve, delay));
    console.log('navigated to', url);

    const urlSeparated = url.split('/');
    const fullPath = path.join(__dirname, '..', 'images', 'theme');
    const themeName = urlSeparated[urlSeparated.length - 2];
    const languageName = urlSeparated[urlSeparated.length - 1];

    const data = await page.screenshot({type: format});

    await asyncForEach(derivates, async (derivate) => {
      const splittedDerivate = derivate.split('x');
      const targetLogo = path.join(fullPath, themeName, `preview_${languageName}_s${derivate}.${format}`);
      const size = {
        width: parseInt(splittedDerivate[0], 10),
        height: parseInt(splittedDerivate[1], 10),
      };
      const buffer = await sharp(data)
      .resize(size.width, size.height)
      .sharpen()
      .png()
      .toBuffer();

      const minifiedBuffer = await imagemin.buffer(buffer, {
        plugins: [imageminPngquant({quality: [0.65, 0.8]})]
      });

      fs.writeFileSync(targetLogo, minifiedBuffer, 'binary');
    });
  }

  await browser.close();
})();
