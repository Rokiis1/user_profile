# User Profile Application

- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Package Manager](#package-manager)
- [Database Structure](#database-structure)
- [Error Handling Approach](#error-handling-approach)

This project is a user profile application built using Node.js, Express, and PostgreSQL. It follows the Model-Controller (MC) pattern within a Monolith Architecture. PostgreSQL is used as the database for storing user profiles and related data.

## Technologies Used

- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine. It allows to run JavaScript on the server side.
- **Express:** Node.js web application framework. Building server-side applications and APIs.
- **node-postgres (PostgreSQL):** A non-blocking PostgreSQL client for Node.js. It allows to interact with a PostgreSQL database, execute SQL queries, and manage database connections.
- **eslint:** A static code analysis tool for identifying and fixing problems in JavaScript code.
- **prettier:** Code formatter that enforces a consistent style by parsing code and re-printing it with its own rules.
- **esbuild:** JavaScript bundler and minifier. It compiles and bundles JavaScript and TypeScript code, optimizing it for production use.
- **pnpm:** Package manager.
- **ajv:** JSON Schema Validator.

## Folder Structure

- `controllers/` - This directory contains logic of the application. Controllers functionality will be handle incoming requests, process them (often by interacting with models), and send responses back to the client.

- `models/` - This directory is for defining native SQL queries. Models represent the structure of your database tables and provide methods to interact with the database.

- `schemas/` - This directory used for defining validation schemas. These schemas ensure that the data meets criteria before it is handled by the controllers.

- `configs/` - This directory contains configuration files for this application. These would be connection settings, environment variables, and other configuration details.

- `routes/` - This directory defines the routes for this application. To request any resource from web-server

- `middlewares/` - This directory contains middleware functions. Middlewares are functions that process requests before they reach the controllers.

## Package Manager

I am choose `pnpm` for really simple thing it's work faster. So just saves files in a content-addressable storage, which means that files are saved once on the disk and shared among all projects, reducing disk space usage and speeding up installations. So this structure name is symlinked or hard-linked structure. Instead of copying files into each project's `node_modules` directory, `pnpm` creates hard links (or sometimes symbolic links) to the files stored in the central content-addressable storage (`~/.pnpm-store`). This way, the same physical files are shared across multiple projects

## Database Structure

The database table structure is defined in the `tables.sql` file.

Using a trigger to assign a default role to new users, I am choose for consistency it's mean every new user is automatically assigned a default role without relying on application logic and also centralized logic to keep role assignment logic within the database, making it easier to manage and update without modifying application code.

```sql
-- Function to assign default role to new users
CREATE OR REPLACE FUNCTION assign_default_role()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_roles (user_id, role_id)
    VALUES (NEW.id, (SELECT id FROM roles WHERE role_name = 'user'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after a new user is inserted
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION assign_default_role();
```

This code snippet you wanna use if you don't use a trigger

```javascript
const defaultRoleQuery = `
    INSERT INTO user_roles (user_id, role_id)
    VALUES ($1, (SELECT id FROM roles WHERE role_name = 'user'));
`;

const roleValues = [user.id];
await client.query(defaultRoleQuery, roleValues);
```

## Error Handling Approach

I chose Layered Error Handling with Specific Error Propagation as the approach for handling errors, which involves validating inputs at the client-side for immediate response, using `ajv` as middleware for server-side validation of request bodies, query parameters, and URL parameters to ensure data integrity and security. In the model layer manage database operations and constraints, and display detailed error messages to the client in the controller. However, handling errors in this way can lead to redundancy. To mitigate this problem, a centralized error handling approach can be used.
