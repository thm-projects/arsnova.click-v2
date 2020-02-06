#!/bin/sh

npm install
node_modules/tslint/bin/tslint -c tslint.json -p tsconfig.json
npm test

npm install -g angular-http-server
npm run build:"$1"

cd /usr/src/app/dist
angular-http-server --path browser/ --silent -p 4711 &

cd /usr/src/app/dist/browser/assets/jobs
node GenerateMetaNodes.js --command=generateLinkImages --baseUrl="$2"
node GenerateMetaNodes.js --command=generateManifest --baseUrl="$2"
node --experimental-modules GenerateImages.mjs --command=all --host=http://localhost:4711 --root=true

cd /usr/src/app
npm run purify
find dist/browser -name "*.*" -type f -print0 | xargs -0 gzip -9 -k
