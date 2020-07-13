#### arsnova.click v2 Frontend

###### Installation 

You can find an Installationguide [here](https://github.com/thm-projects/arsnova.click-v2/blob/master/documentation/Frontend-Installationguide.md)  

###### Global Dependencies

- CentOS / RHEL
    - `yum install google-chrome-stable gcc-c++ make clang libtiff libwmf-lite openjpeg2-devel libtool-ltdl-devel fftw3-devel djvulibre-devel OpenEXR-devel llibwebp4 libtool-ltdl-devel fftw3-devel djvulibre-devel libpng-devel`
    - Download `ImageMagick`and `ImageMagick-Libs` rpm packages from [https://www.imagemagick.org/script/download.php](https://www.imagemagick.org/script/download.php) and install them
    - Download `GraphicsMagick` from [http://www.graphicsmagick.org/download.html](http://www.graphicsmagick.org/download.html) and install it (use ./configure CC=clang)
- Debian / Ubuntu
    - `apt-get install --allow-unauthenticated gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget`
- Alpine Linux
    - `apk add udev chromium ttf-freefont`
- Windows
    - Feel free to provide a guide :)

###### Environment Variables
- `themes`: List of the themes which should be built as serialized JSON Array containing string values
- `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`: Set to prevent puppeteer from downloading a local version of chromium
- `CHROMIUM_PATH`: Points to the binary of the Chromium Browser (required by puppeteer)
- `CHROME_BIN`: Points to the binary of the Chromium Browser (required by karma)

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
Go to the root directory and enter `npm run dev:ssr` or use `docker-compose up -d local` to build the app for the local environment. For local development the ssr node process should be given the environment
variable "NODE_ENV=development" since the underlying express server will proxy the requests to the backend using another port correctly then without the requirement
of a proxy server like nginx. See `src/proxy.conf.json` for details about the proxy configuration.

###### Build (PROD)
Go to the root directory and enter `npm run build:PROD` or use a custom Dockerfile to run your environment
