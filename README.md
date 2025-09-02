# POOSD-Group4-SmallProject
- Group 4's Small Project for POOSD with Dr. Aedo
### Local Docker Example
- This is a demonstration of the colors lab running locally using Docker.
    - This requires that Docker Desktop is installed from https://www.docker.com/get-started/
- Before starting your container, you need to run the setup_env.sh script to designate what the password for your database will be
    - setup_env.sh will create a file called .env that will store your password in an environmental variable used by the docker config
    - Ensure that setup_env.sh has execute permissions for your users by running the command:
    ```
    chmod u+x setup_env.sh
    ```
    - Run the script using the following command in the /tools directory:
    ```
    ./setup_env.sh
    ```
    - NOTE: You cannot change this password without hard resetting the database, so choose a password you will remember.
- To start the docker container, navigate to this directory in the command line and type the command:
```
docker-compose up -d
```
- When finished, shut down the container with the following command:
```
docker-compose down
```
- If changes are made to either docker config files, run the following command:
```
docker-compose up -d --build
```
### Making Changes to MySQL Database
- To run mysql, use the following command:
```
docker exec -it lamp-db-1 mysql -u root -p
```
- If you are using a terminal such as Git Bash, you may need to use this command instead:
```
winpty docker exec -it lamp-db-1 mysql -u root -p
```
- Running these commands will then open the familiar MySQL terminal


