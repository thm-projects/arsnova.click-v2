const CDP = require('chrome-remote-interface');
const argv = require('minimist')(process.argv.slice(2));
const file = require('fs');
const path = require('path');

// CLI Args
const urls = argv.urls ? JSON.parse(argv.urls) : [argv.url || 'https://www.google.com'];
const format = argv.format === 'png' ? 'png' : 'jpeg';
const viewportWidth = argv.viewportWidth || 1024;
const viewportHeight = argv.viewportHeight || 768;
const delay = argv.delay || 0;
const userAgent = argv.userAgent;
const fullPage = argv.full;

// Start the Chrome Debugging Protocol
CDP(async function (client) {
  // Extract used DevTools domains.
  const {DOM, Emulation, Network, Page, Runtime} = client;

  // Enable events on domains we are interested in.
  await Page.enable();
  await DOM.enable();
  await Network.enable();

  // If user agent override was specified, pass to Network domain
  if (userAgent) {
    await Network.setUserAgentOverride({userAgent});
  }

  // Set up viewport resolution, etc.
  const deviceMetrics = {
    width: viewportWidth,
    height: viewportHeight,
    deviceScaleFactor: 1,
    mobile: false,
    fitWindow: true,
  };
  await Emulation.setDeviceMetricsOverride(deviceMetrics);
  await Emulation.setVisibleSize({width: viewportWidth, height: viewportHeight});

  const host = /127.0.0.1/.test(urls[0]) ?
    'http://127.0.0.1' : /localhost/.test(urls[0]) ?
      'http://localhost' : /staging.arsnova.click/.test(urls[0]) ?
      'staging.arsnova.click' : /beta.arsnova.click/.test(urls[0]) ?
        'beta.arsnova.click' : /arsnova.click/.test(urls[0]) ?
          'arsnova.click' : '';

  Network.setCookie({
    'name': 'cookieconsent_status',
    'value': 'dismiss',
    'domain': host,
    'path': '/',
    'expires': (new Date()).getTime() + (1000 * 60 * 60)
  });

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const urlSeparated = url.split('/');
    const imgPath = path.join(__dirname, '..', 'images', 'theme', urlSeparated[urlSeparated.length - 2], 'preview_' + urlSeparated[urlSeparated.length - 1] + '.' + format);
    await runNavigation({Page, DOM, Emulation, client, url, imgPath});
  }
  client.close();

}).on('error', err => {
  console.error('Cannot connect to browser:', err);
});

async function runNavigation({Page, DOM, Emulation, client, url, imgPath}) {

  return new Promise(async resolve => {
    // Navigate to target page
    await Page.navigate({url});

    // Wait for page load event to take screenshot
    await Page.loadEventFired(async () => {
      if (file.existsSync(`${imgPath}`)) {
        return;
      }

      // If the `full` CLI option was passed, we need to measure the height of
      // the rendered page and use Emulation.setVisibleSize
      if (fullPage) {
        const {root: {nodeId: documentNodeId}} = await DOM.getDocument();
        const {nodeId: bodyNodeId} = await DOM.querySelector({
          selector: 'body',
          nodeId: documentNodeId,
        });
        const {model: {height}} = await DOM.getBoxModel({nodeId: bodyNodeId});

        await Emulation.setVisibleSize({width: viewportWidth, height: height});
        // This forceViewport call ensures that content outside the viewport is
        // rendered, otherwise it shows up as grey. Possibly a bug?
        await Emulation.forceViewport({x: 0, y: 0, scale: 1});
      }

      const screenshot = await Page.captureScreenshot({format});
      file.writeFile(`${imgPath}`, screenshot.data, function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log(`Preview for ${url} generated`);
        }
        resolve();
      });
    });

  });
}