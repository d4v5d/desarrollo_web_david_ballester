-- Active: 1759884293194@@127.0.0.1@3306@tarea2
CREATE USER 'cc5002'@'localhost' IDENTIFIED BY 'programacionweb';
-- Grant select privilege to all databases;
GRANT SELECT ON tarea2.* TO 'cc5002'@'localhost' WITH GRANT OPTION;
-- Grant all privileges to all databases;
GRANT ALL PRIVILEGES ON tarea2.* TO 'cc5002'@'localhost' WITH GRANT OPTION;