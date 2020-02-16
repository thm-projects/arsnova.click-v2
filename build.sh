#!/bin/sh

echo "Installing npm modules"
npm install
echo "Running tslint"
node_modules/tslint/bin/tslint -c tslint.json -p tsconfig.json
echo "Running unit tests"
npm test

echo "Installing angular-http-server"
npm install -g angular-http-server

echo "Building the app"
npm run build:"$1"

cd /usr/src/app/dist
echo "Starting the http server"
angular-http-server --path browser/ --silent -p 4711 &

cd /usr/src/app/dist/browser/assets/jobs
echo "Generating link images"
node GenerateMetaNodes.js --command=generateLinkImages --baseUrl="$2"

echo "Generating manifest"
node GenerateMetaNodes.js --command=generateManifest --baseUrl="$2"

echo "Generating preview screenshots"
node --experimental-modules GenerateImages.mjs --command=all --host=http://localhost:4711 --root=true

cd /usr/src/app
# Disabled for now since purifyCSS removes nearly all css with Angular 9
# echo "Purifying css"
# npm run purify
echo "Gzipping app files"
find dist/browser -name "*.*" -type f -print0 | xargs -0 gzip -9 -k
