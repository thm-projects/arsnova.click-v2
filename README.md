#### arsnova.click v2 Frontend

###### Global Dependencies

CentOS / RHEL

- `yum install google-chrome-stable gcc-c++ make clang libtiff libwmf-lite openjpeg2-devel libtool-ltdl-devel fftw3-devel djvulibre-devel OpenEXR-devel llibwebp4 libtool-ltdl-devel fftw3-devel djvulibre-devel libpng-devel`
- Download `ImageMagick`and `ImageMagick-Libs` rpm packages from [https://www.imagemagick.org/script/download.php](https://www.imagemagick.org/script/download.php) and install them
- Download `GraphicsMagick` from [http://www.graphicsmagick.org/download.html](http://www.graphicsmagick.org/download.html) and install it (use ./configure CC=clang)

###### Environment Variables
- `CHROME_BIN`: Points to the binary of the Google Chrome Browser

###### Jobs
Use `npm run job:images` or directly `node --experimental-modules jobs/GenerateImages.mjs` to generate the logo and preview images. Note, that the frontend must be running for the preview screenshots.
Available commands (via running the nodejs module or by passing the command with the --command= switch) are:
- `all - Will call all methods below synchronously`
- `generateFrontendPreview - Adds the preview screenshots for the frontend. The frontend must be running!`
- `generateLogoImages - Generates the logo images (used for favicon and manifest files)`

###### Test
Enter `npm test` in the root directory to run the unit tests.
It is required to define the location of a local Google Chrome installation to use the headless mode

###### Run (DEV)
Go to the root directory and enter `npm start:DEV`.

###### Build (PROD)
Go to the root directory and enter `npm run build:PROD`.
To test the live build enter `npm run prod-test`. 
This will build the regular production bundle and startup a simple http-server which will serve the files.

###### Build (SSR)
Go to the root directory and enter `npm run build:SSR`.
This will trigger the serverside rendering build. 
It will build the production app and a node server which will prerender the angular app before it is sent to the client.
You can also enter `npm run prod-test:SSR` to build and startup the serverside rendering feature.
