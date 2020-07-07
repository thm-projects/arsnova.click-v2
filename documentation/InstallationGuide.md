# How to install the arsnova.click frontend

## Dependencies 

1. Ubuntu 14.04+ or Mac
3. Typescript version 3.7.5
4. Node lts version 12.x

- - -

## Installation 

1. Clone the project from Git by typing 

        git clone https://git.thm.de/arsnova/arsnova-click-v2-frontend
    - - - 

2. Navigate into the project using 

        cd arsnova-click-frontend
    - - - 

3. Open the `environment.ts` file in `src/environments` folder. Add the code below to the `stompConfig` tag. Example:  

        user: '<myUser>',
        password: '<myPassword>',
    - - -

4. Now install all node dependencies by using 

        npm install

- - -


## Execution 

1. Set the `NODE_ENV` environment variable

        export NODE_ENV=development
    - - - 

2. Run the frontend using 

        npm run dev:ssr

   you should find the frontend on http://localhost:4200/

- - - 