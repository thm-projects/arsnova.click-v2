const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname + '/assets/i18n');
const excludedFileEndings = ['md'];
const files = fs.readdirSync(basePath);

const flatObject = (obj, keyPrefix = null) =>
  Object.entries(obj).reduce((acc, [key, val]) => {
    const nextKey = keyPrefix ? `${keyPrefix}.${key}` : key

    if (typeof val !== "object") {
      return {
        ...acc,
        [nextKey]: val
      };
    } else {
      return {
        ...acc,
        ...flatObject(val, nextKey)
      };
    }

  }, {});

// Read contents and parse JSON
const filesWithKeys = files.filter(f => !excludedFileEndings.some(ending => f.endsWith(ending))).map(f => ({
  name: f,
  keys: Object.keys(flatObject(JSON.parse(fs.readFileSync(path.join(basePath, f), 'utf8'))))
}));

// Gather all the keys used in all files in one array
const allKeys = filesWithKeys.map(f => f.keys).flat().filter((value, index, array) => array.indexOf(value) === index);

// Find the missing keys by file
const missingKeysByFile = filesWithKeys.map(f => ({
  name: f.name,
  missingKeys: allKeys.filter(k => !(f.keys.includes(k)))
})).filter(f => f.missingKeys.length > 0);

// Print the result
missingKeysByFile.forEach(f => {
  console.log(`i18n-check: File "${f.name}" is missing keys [ "${f.missingKeys.join('", "')}" ]`);
});

if (missingKeysByFile.length) {
  process.exit(1);
} else {
  console.log('i18n-check: Everything fine. No missing keys found');
  process.exit(0);
}
