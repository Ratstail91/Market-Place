CREATE DATABASE marketplace;

CREATE USER 'marketplace'@'localhost' IDENTIFIED BY 'marketplace';

GRANT ALL ON marketplace.* TO 'marketplace'@'localhost';

