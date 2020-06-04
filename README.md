#### arsnova.click v2

arsnova.click is back! Now completely rewritten with Angular and Typescript.

Still the same styles, still the same features. Yet, nearly the entire code has been rewritten for full feature support of a fast, small, chunked, progressive web app setting the standards of gamificated Audience Response Systems.

Submit bug reports to the [Gitlab Issue Board](https://git.thm.de/arsnova/arsnova-click-v2/issues). Please be very specific on how to reproduce the issue. Attach screenshots or link repo where the error occurs. Provide details of your environment.

Feel free to contribute to the project. Before starting your work, please visit the [Contribution Guide](./CONTRIBUTING.md)

###### Core Technologies
- Angular 9
- Serverside Rendering thanks to Angular Universal
- Bootstrap 4.5
- Progressive WebApp
- NodeJS Express Backend with TypeScript
- WebSocket Communication to RabbitMQ
- Data is stored in a MongoDB

###### Major Features
- Customizable Themes
- 8 unique Types of Questions
- LaTeX support
- MathJax rendering
- Github Flavored Markdown
- Export reports as Excel File
- Bonus token for students
- 5 supported languages
- QR Code for quick quiz joining
- Lists of predefined Nicknames available
- Sounds for the Quiz Lobby and the Countdown
- Gamification animations
- Challenge quizzes as a team with a fair final score

###### Global Dependency Requirements
- Node.js v12
- NPM v6
- Angular CLI v9
- Docker

###### Cloning from git
Install NodeJS and NPM and add the binaries to the path variable.
To install the angular core globally, enter `npm install -g @angular/core`. Test with `ng -v` in the terminal.

Don't forget to install the dependencies for each module aswell with `npm i` in the module directory.

Considering the IntelliJ IDEA IDE it is advised to create a `File => New => Project from existing sources` for the arsnova-click-v2 repo. 
Then include the other modules of arsnova-click-v2 as `File => New => Module from existing sources`.
Use as location the corresponding cloned git module. Repeat the step for all required modules.

###### Installation & Building instructions
Further instructions how to install and build the frontend and backend apps can be found in the README files of the respective repositories.
- [Backend](https://git.thm.de/arsnova/arsnova-click-v2-backend/blob/master/README.md)
- [Frontend](https://git.thm.de/arsnova/arsnova-click-v2-frontend/blob/master/README.md)

Or check out our [developer guide](https://git.thm.de/arsnova/arsnova-click-v2/wikis/home) in the wiki
