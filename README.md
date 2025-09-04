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
docker exec -it your_database_container mysql -u root -p
```
- If you are using a terminal such as Git Bash and get the error message: the input device is not a tty, you may need to use this command instead:
```
winpty docker exec -it your_database_container mysql -u root -p
```
- Running these commands will then open the familiar MySQL terminal
### MySQL Database Setup
- To fill the database with all entries given in the example, execute the following command
```
docker exec -i your_database_container mysql -u root -p'your_password' COP4331 < backup.sql
```
- Once this has run, you just need to add a user to your database so the API can access it.
```
create user 'TheBeast' identified by 'WeLoveCOP4331';
grant all privileges on COP4331.* to 'TheBeast'@'%';
```
- Now your example app should be running on http://localhost:8000
- If you already had it open and are still receiving errors, try clearing your cache.
    - On Google Chrome, you can enter developer mode with F12, then right click the refresh button to do a hard reload.
### Testing APIs Locally
- You may still use Postman, but if you try and test the API through http://localhost:8000 on the web app normally, you will get an error stating that you need to install the Postman Desktop Agent
- You can find the downloads for Postman Agent here: https://www.postman.com/downloads/postman-agent/
    - This application will run in the background, and will allow you to test your endpoints on your locally running app through Postman in the browser. 
### Version Information
- The created Docker container will be running MySQL 8.0.43 and Apache 2.4.65
- The official DigitalOcean LAMP template runs Apache 2.4.58, but the core functionality of .58 and .65 are identical.

