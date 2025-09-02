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
    read -p "Would you like to change your password? (y/n): " response
    
    while [[ "${response,,}" != y && "${response,,}" != n ]]; do
        read -p "Please respond with either 'y' or 'n': " response
    done

    if [ "${response,,}" == y ]; then
        configure_env
    fi
else
    configure_env
fi
