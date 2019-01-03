const puppeteer = require('puppeteer');
const path = require('path');
const file = require('fs');
const argv = require('minimist')(process.argv.slice(2));

const urls = argv.urls ? JSON.parse(argv.urls) : [argv.url || 'https://www.google.com'];
const format = argv.format === 'png' ? 'png' : 'jpeg';
const viewportWidth = argv.viewportWidth || 1024;
const viewportHeight = argv.viewportHeight || 768;
const delay = argv.delay || 0;
const params = argv.noSandbox ? {args: ['--no-sandbox', '--disable-setuid-sandbox']} : {};

(async () => {
  const browser = await puppeteer.launch(params);
  const page = await browser.newPage();

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
    await page.goto(url, {waitUntil: 'networkidle0'});
    console.log('navigated to ', url);

    const urlSeparated = url.split('/');
    const themeImage = path.join(urlSeparated[urlSeparated.length - 2], 'preview_' + urlSeparated[urlSeparated.length - 1] + '.' + format);
    const imgPath = path.join(__dirname, '..', 'images', 'theme', themeImage);

    await page.screenshot({path: imgPath});
  }

  await browser.close();
})();