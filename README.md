## Full-Stack E-Commerce Platform

A modern full-stack e-commerce application featuring a React-driven user interface and a Java backend service designed for scalable user administration and e-commerce operations.

## Architecture & Project Structure

The project is structured as a monorepo containing decoupled modules for both the frontend client and the core backend service:

Ecommerce_Project/

├── frontend/           # React + Vite web interface

└── user-service/       # Java / Spring Boot service


## Tech Stack

Frontend: React, Vite, JavaScript (ES6+), HTML5, CSS3

Backend: Java, Spring Boot, RESTful APIs, Maven

Database: Relational Database (MySQL)

Version Control: Git, GitHub

## Core Features

### User Authentication & Management: Handles secure user onboarding, authentication, and profile administration.

### Admin Operations : 

Handles listing new categories and products, 

Update or delete existing categories and products, 

View all users list and search users, 

View orders and order details with their status and change their status.

### User Operations :

Interactive frontend components for browsing and searching categories and items,

Add products to Wishlist and remove any product from Wishlist,

Add products to cart, increase or decrease quantity and remove items from cart

Add new shipping address or choose from existing addresses,

Create Orders from cart and view all the previous orders along with their status.

Cancel or generate return request for ordered items.

Decoupled Service Architecture: Separate client and server modules structured for maintainability and independent deployment.

## Getting Started (Running Locally)

To run this project locally on your machine, follow these steps:

### Prerequisites
- Node.js (v18+) & npm
- Java Development Kit (JDK 17+)
- Maven
- MySQL Server
- Git

### **1. Clone the Repository**
```bash
git clone [https://github.com/PriyadarshiniBhattacharya-DEV/Ecommerce_Project.git](https://github.com/PriyadarshiniBhattacharya-DEV/Ecommerce_Project.git)
cd Ecommerce_Project
```
### 2. Database Setup
Open your MySQL client (MySQL Workbench, terminal, etc.) and create a local database:
```MYSQL
CREATE DATABASE ecommerce_db;
```

Navigate to user-service/src/main/resources/application.properties and update your local database credentials:

```
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### 3. Run the Backend (user-service)

Navigate to the backend directory and start the Spring Boot application using Maven:

```
cd user-service
mvn clean spring-boot:run
```
Note: The backend REST API service will start on http://localhost:8080.

### 4. Run the Frontend (frontend)

Open a new terminal window, navigate to the frontend directory, install dependencies, and start the Vite development server:
```
cd frontend
npm install
npm run dev
```
Note: The React application will start on http://localhost:5173.

## License

This project is open-source and available under the MIT License.
