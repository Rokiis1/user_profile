-- Users Table (One-to-One relationship with user_secrets and profiles)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for unique constraints and frequently queried columns
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- User Secrets Table (One-to-One relationship with users)
CREATE TABLE user_secrets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for foreign key and frequently queried columns
CREATE INDEX idx_passwords_user_id ON user_secrets(user_id);

-- Countries Table (Many-to-One relationship with profiles)
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    country_name VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO countries (country_name) VALUES 
('Lithuania'), 
('France'), 
('United Kingdom'), 
('China');
('Bulgaria');

-- Profiles Table (One-to-One relationship with users)
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    bio TEXT,
    profile_picture VARCHAR(255),
    age INTEGER,
    country_id INTEGER REFERENCES countries(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Indexes for foreign key and frequently queried columns
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_first_name ON profiles(first_name);
CREATE INDEX idx_profiles_last_name ON profiles(last_name);
CREATE INDEX idx_profiles_age ON profiles(age);
CREATE INDEX idx_profiles_country ON profiles(country);
CREATE INDEX idx_profiles_country_id ON profiles(country_id);

-- Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Indexes for unique constraints
CREATE INDEX idx_roles_role_name ON roles(role_name);

-- Insert default roles
INSERT INTO roles (role_name) VALUES ('user'), ('admin');

-- User Roles Table (Many-to-Many relationship between users and roles)
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Indexes for foreign keys
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

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