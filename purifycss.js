let path = require('path');
let fs = require('fs');
// https://github.com/purifycss/purifycss
let purifycss = require('purify-css');

function fromDir(startPath, filter, callback) {

  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);
    return;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename, filter, callback); // recurse
    } else if (filter.test(filename)) {
      callback(filename);
    }
  }
}

fromDir('./dist/browser', /theme-.*\.css$/, function (filename) {
  const content = ['./dist/browser/*.js', './dist/browser/*.html'];
  const css = [filename];

  const options = {
    output: filename,
    minify: true,
    info: true,
  };
  console.log('-- found: ', filename);
  purifycss(content, css, options);
});
