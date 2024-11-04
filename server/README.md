# User Profile Application

- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Database Table Structure](#database-table-structure)
- [Error Handling Approach](#error-handling-approach)

This project is a user profile application built using Node.js, Express, and PostgreSQL. It follows the Model-Controller (MC) pattern within a Monolith Architecture. PostgreSQL is used as the database for storing user profiles and related data.

## Technologies Used

- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine. It allows to run JavaScript on the server side.
- **Express:** Node.js web application framework. Building server-side applications and APIs.
- **node-postgres (PostgreSQL):** A non-blocking PostgreSQL client for Node.js. It allows to interact with a PostgreSQL database, execute SQL queries, and manage database connections.
- **eslint:** A static code analysis tool for identifying and fixing problems in JavaScript code.
- **prettier:** An opinionated code formatter that enforces a consistent style by parsing your code and re-printing it with its own rules. It helps in maintaining a uniform code style across the project.
- **esbuild:** JavaScript bundler and minifier. It compiles and bundles JavaScript and TypeScript code, optimizing it for production use.

## Folder Structure

- `controllers/` - This directory contains the business logic of your application. Controllers handle incoming requests, process them (often by interacting with models), and send responses back to the client.

- `models/` - This directory is for defining the data models and writing native SQL queries. Models represent the structure of your database tables and provide methods to interact with the database.

- `schemas/` - This directory is typically used for defining validation schemas. These schemas ensure that the data being processed meets certain criteria before it is handled by the controllers.

- `configs/` - This directory contains configuration files for your application. These files might include database connection settings, environment variables, and other configuration details.

- `routes/` - This directory defines the routes for your application. Routes map HTTP requests to specific controller actions.

## Database Table Structure

The database table structure is defined in the `tables.sql` file.

## Error Handling Approach

I chose Layered Error Handling with Specific Error Propagation as the approach for handling errors, which involves validating inputs at the client-side for immediate feedback, performing server-side validation to ensure data integrity and security, enforcing database constraints to maintain consistency, and handling errors directly in the model and controller layers to provide detailed error messages and aid in debugging, though it can lead to redundancy and code duplication.
