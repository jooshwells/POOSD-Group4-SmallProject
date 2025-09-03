# Start from the official PHP-Apache image we were already using
FROM php:8.2-apache

# Install the necessary PHP extensions for MySQL
# pdo_mysql is for the PDO connection method you're using
# mysqli is another common MySQL driver, good to have
RUN docker-php-ext-install pdo_mysql mysqli