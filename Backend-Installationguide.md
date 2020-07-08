# How to install the arsnova-click backend

## Dependencies 

1. Ubuntu 14.04+ or Mac
2. Docker & docker-compose
3. Typescript version 3.7.5
4. Node lts version 12.x

## Installation 

1. Clone the git project using 

        git clone https://git.thm.de/arsnova/arsnova-click-v2-backend
    - - - 

2. Navigate to the Project with 

        cd arsnova-click-v2-backend
    - - - 

3. Create 7 files using

        touch arsnova-click.env mongo.env init-mongo.js rabbitmq.env arsnova-click-staging.env arsnova-click-beta.env arsnova-click-export.env
    - - - 

4. Install node depencencies type

        npm install 
    - - - 

5. Create 2 folders with

        mkdir rabbitmq mongodb

    and give the rabbitmq folder the permissions to read, write and execute using 

        chmod 777 rabbitmq
    - - -

6. Copy: 

        export MONGODB_SERVICE_NAME=localhost
        export MONGODB_DATABASE=arsnova-click-v2
        export MONGODB_USER=root
        export MONGODB_PASSWORD=pass123
        export MONGODB_AUTH_SOURCE=arsnova-click-v2
        export LOG_LEVEL=debug
        export NODE_ENV=development
        export AMQP_HOSTNAME=localhost
        export AMQP_USER=<myUser>
        export AMQP_PASSWORD=<myPassword>

    into the `arsnova-click-export.env` file. 
    - - - 

7. Copy: 

        MONGO_INITDB_DATABASE=arsnova-click-v2
        MONGO_INITDB_ROOT_USERNAME=user
        MONGO_INITDB_ROOT_PASSWORD=pass123

    into the `mongo.env` file. 
    - - - 

8. Copy: 

        db.createUser(
            {
                user: "root",
                pwd: "pass123",
                roles: [
                    {
                        role: "readWrite",
                        db: "arsnova-click-v2"
                    }
                ]
            }
        );

    into the `init-mongo.js` file. 
    - - - 

9. Copy: 

        MONGODB_SERVICE_NAME=localhost
        MONGODB_DATABASE=arsnova-click-v2
        MONGODB_USER=root
        MONGODB_PASSWORD=pass123
        MONGODB_AUTH_SOURCE=arsnova-click-v2
        LOG_LEVEL=debug
        NODE_ENV=development
        AMQP_HOSTNAME=localhost
        AMQP_USER=<myUser>
        AMQP_PASSWORD=<myPassword>
    
    into the `arsnova-click.env` file. 
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

4. Build the project 

        npm run build:DEV
    - - - 

5. Run the project 
        cd dist && node main.js
    - - - 
