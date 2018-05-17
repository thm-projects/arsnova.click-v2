#### Project description

arsnova.click is back! Now completely rewritten with Angular5 and Typescript.

Still the same styles, still the same features. Yet, nearly the entire code has been rewritten for full feature support of a fast, small, chunked, progressive web app setting the standards of gamificated Audience Response Systems.

Submit bug reports to the [Gitlab Issue Board](https://git.thm.de/arsnova/arsnova.click-v2/issues). Please be very specific on how to reproduce the issue. Attach screenshots or link repo where the error occurs. Provide details of your environment.

For full instructions on how to set up the correct environment, visit the [Contribution Guide](./CONTRIBUTING.md)

---
#### Core Technologies
- Angular 6
- Express Backend with TypeScript
- Bootstrap 4.1
- WebSocket Communication
- Progressive WebApp

---
#### Major Features
- Customizable Themes
- 8 unique Types of Questions
- LaTeX
- MathJax
- Github Flavored Markdown
- Export reports as Excel File
- Authentication via CAS
- 5 supported languages
- QR Code for quick quiz joining
- Lists of predefined Nicknames available
- Sounds for the Quiz Lobby and the Countdown
- Gamification animations
- Challenge quizzes as a team with a fair final score

---
#### Configuration

###### Backend
The backend can be configured environment variables. The following options available:
- `BACKEND_PORT_INTERNAL [number]` This is the external port used for rewriting the urls of cached quizzes.
- `BACKEND_PORT_EXTERNAL [number]` This is the internal port used during the startup of the server.
- `BACKEND_ROUTE_PREFIX [string]` The routePrefix is used to prefix the access of the Express routes. E.g if set to 'backend' the access to '/api/v1/myPath' will become '/backend/api/v1/myPath'.
- `BACKEND_REWRITE_ASSET_CACHE_URL [string]` This configuration is used as base endpoint for cached assets.
- `BACKEND_THEME_PREVIEW_HOST [string]` Target of the Http Server which delivers the template for the theme preview generation.

The command to use is `export [config] [value]`.

The backend requires a local installation of `imagemagick` and `graphicsmagick`.

Use `npm run job:images` or directly `node --experimental-modules jobs/GenerateImages.mjs` to generate the logo and preview images. Note, that the frontend must be running for the preview screenshots.
Available commands (via running the nodejs module or by passing the command with the --command= switch) are:
- `all - Will call all methods below synchronously`
- `generateFrontendPreview - Adds the preview screenshots for the frontend. The frontend and the backend must be running!`
- `generateLogoImages - Generates the logo images (used for favicon and manifest files)`

#### Test
###### Backend
Enter `npm test` in the arsnova-click-v2-backend repo to run all unit tests. As an alternative you can enter `npm test` in the main project, too.
Currently the routing and the quiz export is covered by the tests. The export unit test will generate an random filled Excel export file in the /backend/test-generated folder.

###### Frontend
Enter `npm test` in the arsnova-click-v2-frontend repo to run the unit tests.

It is required to define the location of a local Google Chrome installation to use the headless mode (ex. `export CHROME_BIN=/usr/bin/google-chrome`)

---
#### Run (DEV deployment)

###### Backend
In the arsnova-click-v2-backend repo enter `npm build:DEV`.

###### Frontend
Go to the arsnova-click-v2-frontend repo and enter `npm start:DEV`

---
#### Build (LIVE deployment)

###### Backend
Head over to the arsnova-click-v2-backend repo and enter `npm run build:PROD`

###### Frontend
Go to the arsnova-click-v2-frontend repo and enter `npm run build:PROD`
To test the live build enter `npm run prod-test`. This will build the regular production bundle and startup a simple http-server which will serve the files.

Note that the build time can take up to ~1 minute
