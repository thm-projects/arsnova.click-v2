# How to install the arsnova-click backend

## Dependencies 

1. Ubuntu 14.04+, Windows 10 or Mac
2. Docker & docker-compose
3. Typescript version that is specified in the [package.json](https://git.thm.de/arsnova/arsnova-click-v2-backend/-/blob/staging/package.json)
4. Node lts version 12.x

## Installation 

1. Clone the git project using 

        git clone https://git.thm.de/arsnova/arsnova-click-v2-backend
    - - - 

2. Navigate to the Project with 

        cd arsnova-click-v2-backend
    - - - 

4. Create 2 folders with

        mkdir rabbitmq mongodb

    and give the rabbitmq folder the permissions to read, write and execute using 

        chmod 777 rabbitmq
    - - -

## Execution

### First time execution 

1. Make sure the docker containers are shut down by typing

        docker ps 

    if any containers are still running, shut them down with 

        docker rm -f <container-name>
    - - - 

2. Source the `export-arsnova-click.env` file with 

        source export-arsnova-click.env
    - - - 

3. Start the docker containers using 

        docker-compose up -d rabbitmq mongodb
    - - - 

4. Open
        
        http://localhost:15672/

    login using 

        Username: user
        Password: bitnami

    navigate to the `Admin` tab and select `Add a user`. Then put in

        Username: <myUser>
        Password: <myPassword>
        Tags: administrator

    and submit using the `Add user` button. 
    Now press on `<myUser>` and press the `Set permission` button. 

    To verify go back to 

        http://localhost:15672/

    and login using `<myUser>` and `<myPassword>`.
    - - - 

5. Shutdown the docker containers using

        docker rm -f arsnova-click-backend-mongodb arsnova-click-backend-rabbitmq
    - - - 

6. Now you can continue with the regular execution. 

### Regular execution

1. Make sure the docker containers are shut down by typing

        docker ps 

    if any containers are still running, shut them down with 

        docker rm -f <container-name>
    - - - 

2. Source the `export-arsnova-click.env` file with 

        source export-arsnova-click.env
    - - - 

3. Start the docker containers using 

        docker-compose up -d rabbitmq mongodb
    - - - 

4. Install node depencencies type (Make sure you are using the correct npm version!!)

        npm install 

        OR 

        npm install --legacy-peer-deps
    - - - 

5. Build the project 

        npm run build:DEV
    - - - 

6. Run the project 

        cd dist && node main.js
    - - - 
