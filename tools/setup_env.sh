#!/bin/bash

configure_env() {
    touch ../.env # create the .env file
    read -s -p "Please create a password for your MySQL database: " pass # read in the password
    
    # clear the contents of .env and write the new password
    > ../.env
    echo "DB_PASSWORD=$pass" >> ../.env
}

if [ -e "../.env" ]; then
    echo ".env already exists!"
else
    configure_env
fi
