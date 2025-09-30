CREATE DATABASE If NOT EXISTS Vasundhara_db;
USE Vasundhara_db;

CREATE TABLE IF NOT EXISTS roles(
		id INT auto_increment PRIMARY KEY,
        name VARCHAR(22) NOT NULL UNIQUE
);

INSERT ignore INTO roles (name) VALUES ('admin') , ('customer');

CREATE TABLE IF NOT EXISTS users(
	id INT auto_increment PRIMARY KEY,
    name VARCHAR(22) NOT NULL,
    email VARCHAR(22) NOT NULL UNIQUE,
    password varchar(22) not NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id)
    
);

CREATE TABLE IF NOT EXISTS brands(
	id INT auto_increment PRIMARY KEY,
    name VARCHAR(33) NOT NULL,
    year int NOT NULL,
    is_exists ENUM('YES','NO') NOT NULL DEFAULT 'YES',
    country VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
	id INT auto_increment PRIMARY KEY,
    brand_id INT NOT NULL,
	name VARCHAR(33) NOT NULL,
    color VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
);
    
