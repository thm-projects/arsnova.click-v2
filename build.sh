#!/bin/sh

echo "Installing npm modules"
npm install
if [[ $? -ne "0" ]]
then
  exit 1
fi

echo "Building unique version hash for the build"
HASH=$(date | md5sum | head -c32)
echo $HASH > src/assets/version.txt
sed -i s/__VERSION__/$HASH/ src/environments/environment*.ts

echo "Building the app"
npm run build:"$1"
if [[ $? -ne "0" ]]
then
  exit 2
fi

echo "Copying assets"
npm run copy:"$1"

cd /usr/src/app
echo "Purifying css"
npm run purify

echo "Regenerating ngsw hashes"
npm run ngsw-config

echo "Renaming css files to a hashed version and add a json file containing the theme and the corresponding hash"
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

echo "Checking if the theme assets need to be regenerated"
stylefile=$(ls | grep "styles.*.css" | head -n 1) > /dev/null
csstype="text/css"
curl -sI "$2/$stylefile" | awk -F ': ' '$1 == "content-type" { print $2 }' | grep $csstype > /dev/null
styletype=$?

curl -s "$2/assets/theme-hashes.json" | diff - assets/theme-hashes.json > /dev/null
hashdiff=$?

if [[ "$styletype" -eq "0" ]] && [[ "$hashdiff" -eq "0" ]]
then
   echo "Styles are equal - no need to regenerate the theme assets but we need to download them"

   for theme in $(echo $themes | jq '.[]')
   do
      theme=$(echo "$theme" | tr -d '"')
      echo "Downloading assets for theme '$theme'"
      mkdir -p assets/images/theme/$theme
      mkdir -p assets/meta/$theme

      curl -s $2/assets/meta/$theme/linkNodes.json > assets/meta/$theme/linkNodes.json
      echo "Download of manifest definition file for theme '$theme' completed"

      for langKey in en de fr it es ;
      do
         langKey=$(echo "$langKey" | tr -d '"')
         for previewSize in $(cat assets/imageDerivates.json | jq '.frontendPreview | .[]')
         do
            previewSize=$(echo "$previewSize" | tr -d '"')
            curl -s $2/assets/images/theme/$theme/preview_${langKey}_s${previewSize}.png > assets/images/theme/$theme/preview_${langKey}_s${previewSize}.png
            echo "Download of preview image '$theme/preview_${langKey}_s${previewSize}.png' completed"
         done

         curl -s $2/manifest_${theme}_${langKey}.json > manifest_${theme}_${langKey}.json
         echo "Download of manifest file for $theme ($langKey version) completed"
      done
      for logoSize in $(cat assets/imageDerivates.json | jq '.logo | .[]')
      do
         logoSize=$(echo "$logoSize" | tr -d '"')
         curl -s $2/assets/images/theme/$theme/logo_s${logoSize}.png > assets/images/theme/$theme/logo_s${logoSize}.png
         echo "Download of logo image '$theme/logo_s${logoSize}.png' completed"
      done
      echo "Download of assets for theme '$theme' completed"
      echo "-------------------------------------------"
   done
else
   echo "Styles are not equal - regenerating theme assets"
   echo "Hashdiff is"
   curl -s "$2/assets/theme-hashes.json" | diff - assets/theme-hashes.json

   cd /usr/src/app
   echo "Starting the ssr server"
   node dist/frontend/server/main.js &
   sleep 3s

   cd /usr/src/app/dist/frontend/browser/assets/jobs
   echo "Generating link images"
   node GenerateMetaNodes.js --command=generateLinkImages --baseUrl="$2"

   echo "Generating manifest"
   node GenerateMetaNodes.js --command=generateManifest --baseUrl="$2"

   echo "Generating preview screenshots"
   node --experimental-modules GenerateImages.mjs --command=all --host=http://localhost:4000 --root=true
fi

echo "Gzipping app files"
cd /usr/src/app/dist/frontend/browser
find . -name "*.*" -type f -print0 | xargs -0 gzip -9 -k
