# How to install the arsnova.click frontend

## Dependencies 

1. Ubuntu 14.04+, Windows 10 or Mac
2. Typescript version that is specified in the [package.json](https://git.thm.de/arsnova/arsnova-click-v2-frontend/-/blob/staging/package.json)
3. Node lts version 12.x
4. Docker & docker-compose

- - -

## Installation 

1. Clone the project from Git by typing 

        git clone https://git.thm.de/arsnova/arsnova-click-v2-frontend
    - - - 

2. Navigate into the project using 

        cd arsnova-click-frontend
    - - - 

3. Open the `environment.ts` file in `src/environments` folder. Add the code below to the `stompConfig` tag. Example:  

        user: 'myUser',
        password: 'myPassword',
    - - -

4. Now install all node dependencies by using 

        npm install

    - - -

5. Quick fix for current [Issue](https://git.thm.de/arsnova/arsnova-click-v2/-/issues/198): 
    Navigate into `node_modules/angular2-hotkeys/lib/hotkeys.service.d.ts` and change line 4 to 

        import { MousetrapInstance } from 'mousetrap';

    Redo this after every `npm install` until the [Issue](https://git.thm.de/arsnova/arsnova-click-v2/-/issues/198) is resolved.

    - - - 


## Execution 

1. Set the `NODE_ENV` environment variable

        export NODE_ENV=development
    - - - 

2. Run the frontend using 

        npm run dev:ssr

   you should find the frontend on http://localhost:4200/

- - - 
