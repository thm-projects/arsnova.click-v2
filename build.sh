#!/bin/sh

echo "Installing npm modules"
npm install

echo "Installing angular-http-server"
npm install -g angular-http-server

echo "Building the app"
npm run build:"$1"

echo "Copying assets"
npm run copy:"$1"

# Renaming css files to a hashed version and add a json file containing the theme and the corresponding hash
cd /usr/src/app/dist/frontend/browser
echo "Building css file hashes"
sha1sum theme-*.css > theme-hashes.txt
echo "Renaming the css files with their hash"
while read p; do
  hash=$(echo "$p" | cut -d ' ' -f1)
  file=$(echo "$p" | cut -d ' ' -f3)
  mv $file "$(echo "$file" | sed s/__CSS_FILE_HASH__/$hash/)"
done < theme-hashes.txt
echo "Building json file which contains a map with the theme name and the current hash"
jq -R -c 'split("\n") | .[] | split(" ") | {hash: .[0], theme: .[2] | rtrimstr("\n") | sub("\\-__CSS_FILE_HASH__.css";"") | sub("theme-";"")}' < theme-hashes.txt | jq -c -s '.' > assets/theme-hashes.json

cd /usr/src/app/dist/frontend/
echo "Starting the http server"
angular-http-server --path browser/ --silent -p 4711 &

cd /usr/src/app/dist/frontend/browser/assets/jobs
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
find dist/frontend/browser -name "*.*" -type f -print0 | xargs -0 gzip -9 -k
