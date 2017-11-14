#### Project description

arsnova.click is back! Now completely rewritten with Angular5 and Typescript.

Still the same styles, still the same features. Yet, nearly the entire code has been rewritten for full feature support of a fast, small, chunked, progressive web app setting the standards of gamificated Audience Response Systems.

Please consider the list of the [ToDo's](./TODOS.md) including the known issues section.

For full instructions on how to set up the correct environment, visit the [DEV Page](./DEV.md)

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
The backend can be configured via npm. There are the following options available:
- `portExternal [number]` This is the external port used for rewriting the urls of cached quizzes.
- `portInternal [number]` This is the internal port used during the startup of the server.
- `routePrefix [string]` The routePrefix is used to prefix the access of the Express routes. E.g if set to 'backend' the access to '/api/v1/myPath' will become '/backend/api/v1/myPath'.
- `rewriteAssetCacheUrl [string]` This configuration is used as base endpoint for cached assets.
- `themePreviewHost [string]` Target of the Http Server which delivers the template for the theme preview generation.

The command to use is `npm config set backend:[config] [value]`. It is required to use this command inside the /backend directory.

---
#### Run (DEV deployment)

###### Backend
Head over to the /backend directory and enter `npm start`

###### Frontend
Go to the /frontend directory and enter `npm start`

---
#### Build (LIVE deployment)

###### Backend
Head over to the /backend directory and enter `npm run prod`

###### Frontend
Go to the /frontend directory and enter `npm run prod`
To test the live build enter `npm run prod-test`. This will build the regular production bundle and startup a simple http-server which will serve the files.

Note that the build time can take up to ~1 minute
