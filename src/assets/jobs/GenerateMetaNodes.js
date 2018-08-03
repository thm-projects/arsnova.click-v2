const path = require('path');
const fs = require('fs');
const process = require('process');
const minimist = require('minimist');
const mkdirp = require('mkdirp');
const mf = require('messageformat');

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
const themeData = require('../themeData');
const imageDerivates = require('../imageDerivates');

class GenerateMetaNodes {

  constructor() {
    this.pathToAssets = path.join(__dirname, '..');
    this.baseUrl = 'http://localhost:4200';
  }

  generateDirectories() {
    this.pathToMetaData = path.join(this.pathToAssets, 'meta');

    if (!fs.existsSync(this.pathToMetaData)) {
      fs.mkdirSync(this.pathToMetaData);
    }
    Object.keys(themeData).forEach((themeName) => {
      const pathToThemeDestination = path.join(this.pathToMetaData, themeName);
      if (!fs.existsSync(pathToThemeDestination)) {
        fs.mkdirSync(pathToThemeDestination);
      }
    });
  }

  help() {
    console.log('----------------------');
    console.log('Available commands:');
    console.log('help - Show this help');
    console.log('generateLinkImages() - Builds the link nodes for the frontend for each theme');
    console.log('generateManifest() - Builds the manifest file for the frontend for each theme and each language');
    console.log('----------------------');
  }

  generateLinkImages() {
    themes.forEach(theme => {
      const basePath = `${this.baseUrl}/assets/images/theme/${theme}`;
      const manifestPath = `${this.baseUrl}/assets/meta/${theme}/manifest_%%LANG%%.json`;

      const result = [
        {
          tagName: 'link',
          className: 'theme-meta-data',
          rel: 'manifest',
          id: 'link-manifest',
          href: `${manifestPath}`,
          type: 'image/png',
        }, {
          tagName: 'link',
          className: 'theme-meta-data',
          rel: 'apple-touch-icon',
          id: 'link-apple-touch-default',
          href: `${basePath}/logo_s32x32.png`,
          type: 'image/png',
        }, {
          tagName: 'link',
          className: 'theme-meta-data',
          rel: 'apple-touch-icon-precomposed',
          id: 'link-apple-touch-precomposed-default',
          href: `${basePath}/logo_s32x32.png`,
          type: 'image/png',
        }, {
          tagName: 'meta',
          className: 'theme-meta-data',
          name: 'theme-color',
          id: 'meta-theme-color',
          content: `${themeData[theme].exportedAtRowStyle.bg}`,
        }, {
          tagName: 'meta',
          className: 'theme-meta-data',
          name: 'msapplication-TileColor',
          id: 'meta-tile-color',
          content: `${themeData[theme].exportedAtRowStyle.bg}`,
        }, {
          tagName: 'meta',
          className: 'theme-meta-data',
          name: 'msapplication-TileImage',
          id: 'meta-tile-image',
          content: `${basePath}/logo_s144x144.png`,
          type: 'image/png',
        },
      ];

      imageDerivates.forEach(derivate => {
        result.push({
          tagName: 'link',
          className: 'theme-meta-data',
          rel: 'icon',
          href: `${basePath}/logo_s${derivate}.png`,
          id: `link-icon-${derivate}`,
          sizes: derivate,
          type: 'image/png',
        }, {
          tagName: 'link',
          className: 'theme-meta-data',
          rel: 'apple-touch-icon-precomposed',
          href: `${basePath}/logo_s${derivate}.png`,
          id: `link-apple-touch-precomposed-${derivate}`,
          sizes: derivate,
          type: 'image/png',
        });
      });

      result.push({
        tagName: 'link',
        className: 'theme-meta-data',
        rel: 'shortcut icon',
        sizes: '64x64',
        id: 'link-favicon',
        href: `${basePath}/logo_s64x64.png`,
        type: 'image/png',
      });

      fs.writeFileSync(`${this.pathToMetaData}/${theme}/linkNodes.json`, JSON.stringify(result));
    });
  }

  generateManifest() {
    languages.forEach(language => {
      const localizer = new mf(language);
      const descriptionMessageSrc = JSON.parse(fs.readFileSync(path.join(this.pathToAssets, 'i18n', `${language}.json`), 'UTF-8')).manifest.description;
      const descriptionMessage = localizer.compile(descriptionMessageSrc)();
      themes.forEach(theme => {
        const manifest = {
          short_name: 'arsnovaClick',
          name: 'arsnova.click',
          description: descriptionMessage,
          background_color: themeData[theme].exportedAtRowStyle.bg,
          theme_color: themeData[theme].exportedAtRowStyle.bg,
          start_url: `${this.baseUrl}`,
          display: 'standalone',
          orientation: 'portrait',
          icons: [],
        };

        imageDerivates.forEach((derivate) => {
          manifest.icons.push({
            src: `${this.baseUrl}/assets/images/theme/${theme}/logo_s${derivate}.png`,
            sizes: derivate,
            type: 'image/png',
          });
        });

        fs.writeFileSync(`${this.pathToMetaData}/${theme}/manifest_${language}.json`, JSON.stringify(manifest));
      });
    });
  }
}

const generateMetaNodes = new GenerateMetaNodes();

const init = () => {
  if (process.argv.length < 2) {
    generateMetaNodes.help();
  } else {
    if (argv.baseDir) {
      generateMetaNodes.pathToAssets = argv.baseDir;
    }
    if (argv.baseUrl) {
      generateMetaNodes.baseUrl = argv.baseUrl;
    }

    generateMetaNodes.generateDirectories();

    if (!argv.command) {
      console.log(`> No command specified: ${JSON.stringify(argv)}`);
      generateMetaNodes.help();
      return;
    }
    if (!generateMetaNodes[argv.command]) {
      console.log(`> Command ${argv.command} not found!`);
      generateMetaNodes.help();
      return;
    }

    switch (argv.command) {
      case 'generateLinkImages':
        generateMetaNodes.generateLinkImages();
        break;
      case 'generateManifest':
        generateMetaNodes.generateManifest();
        break;
      default:
        throw new Error(`No command handling specified for ${argv.command}`);
    }
  }
};

init();
