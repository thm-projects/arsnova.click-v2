const system = require('system');
const webpage = require('webpage');
const page = webpage.create();
const args = system.args;

args.shift();
handlePageLoad();

function handlePageLoad() {
  const url = nextPage();
  if (!url) {
    return;
  }
  page.open(url).then(function() {
    page.viewportSize = { width:1280, height:720 };
    setTimeout(function() {
      const urlSeparated = url.split('/');
      page.render('images/themes/' + urlSeparated[urlSeparated.length - 2] + '_' + urlSeparated[urlSeparated.length - 1] + '.png',
        {onlyViewport: false});
      handlePageLoad();
    }, 800);
  });
}

function nextPage() {
  const url = args.shift();
  if (!url) {
    console.log('All files have been handled, exiting process');
    phantom.exit(0);
    return;
  }
  const host = /localhost/.test(url) ? 'localhost' : /staging.arsnova.click/.test(url) ? 'staging.arsnova.click' : /arsnova.click/.test(url)
    ? 'arsnova.click' : '';
  phantom.addCookie({
    'name': 'cookieconsent_status',
    'value': 'dismiss',
    'domain': host,
    'path': '/',
    'expires': (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
  });
  console.log('Handling url', url, 'from args', args);
  return url;
}


