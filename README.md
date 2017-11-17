#### Project description

arsnova.click is back! Now completely rewritten with Angular5 and Typescript.

Still the same styles, still the same features. Yet, nearly the entire code has been rewritten for full feature support of a fast, small, chunked, progressive web app setting the standards of gamificated Audience Response Systems.

Submit bug reports to the [Gitlab Issue Board](https://git.thm.de/arsnova/arsnova.click-v2/issues). Please be very specific on how to reproduce the issue. Attach screenshots or link repo where the error occurs. Provide details of your environment.

For full instructions on how to set up the correct environment, visit the [Contribution Guide](./CONTRIBUTING.md)

---
#### Core Technologies

- Angular 5
- Express Backend with TypeScript
- Bootstrap 4
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

---
#### Configuration

###### Backend
The backend can be configured via npm. The following options available:
- `portExternal [number]` This is the external port used for rewriting the urls of cached quizzes.
- `portInternal [number]` This is the internal port used during the startup of the server.
- `routePrefix [string]` The routePrefix is used to prefix the access of the Express routes. E.g if set to 'backend' the access to '/api/v1/myPath' will become '/backend/api/v1/myPath'.
- `rewriteAssetCacheUrl [string]` This configuration is used as base endpoint for cached assets.
- `themePreviewHost [string]` Target of the Http Server which delivers the template for the theme preview generation.

The command to use is `npm config set arsnova-click-v2-backend:[config] [value]`. It is required to use this command inside the arsnova-click-v2-backend repo.

#### Test
###### Backend
Enter `npm test` in the arsnova-click-v2-backend repo to run all unit tests. As an alternative you can enter `npm test` in the main project, too.
Currently the routing and the quiz export is covered by the tests. The export unit test will generate an random filled Excel export file in the /backend/test-generated folder.

---
#### Run (DEV deployment)

###### Backend
Head over to the arsnova-click-v2-backend repo and enter `npm start`

###### Frontend
Go to the arsnova-click-v2-frontend repo and enter `npm start`

---
#### Build (LIVE deployment)

###### Backend
Head over to the arsnova-click-v2-backend repo and enter `npm run prod`

###### Frontend
Go to the arsnova-click-v2-frontend repo and enter `npm run prod`
To test the live build enter `npm run prod-test`. This will build the regular production bundle and startup a simple http-server which will serve the files.

Note that the build time can take up to ~1 minute
