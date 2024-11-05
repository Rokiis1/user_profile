import { pool } from "../configs/postgresSettings.mjs";

const usersModel = {
  getUsers: async () => {
    let client;
    try {
      client = await pool.connect();
      const query = `
        SELECT users.id, users.username, users.email, users.created_at, users.updated_at, roles.role_name as role
        FROM users
        LEFT JOIN user_roles ON users.id = user_roles.user_id
        LEFT JOIN roles ON user_roles.role_id = roles.id;
      `;
      const result = await client.query(query);

      if (result.rows.length === 0) {
        throw new Error("No users found");
      }

      return result.rows;
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }

      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  getUserById: async (userId) => {
    let client;
    try {
      client = await pool.connect();

      const query = `
        SELECT users.id, users.username, users.email, users.created_at, users.updated_at, roles.role_name as role
        FROM users
        LEFT JOIN user_roles ON users.id = user_roles.user_id
        LEFT JOIN roles ON user_roles.role_id = roles.id
        WHERE users.id = $1;
      `;

      const values = [userId];

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error("User not found");
      }

      return result.rows[0];
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }

      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  createUser: async (username, email, password) => {
    let client;

    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const emailCheckQuery = "SELECT id FROM users WHERE email = $1;";
      const emailCheckResult = await client.query(emailCheckQuery, [email]);

      if (emailCheckResult.rows.length > 0) {
        throw new Error("Email already exists");
      }

      const usernameCheckQuery = "SELECT id FROM users WHERE username = $1;";
      const usernameCheckResult = await client.query(usernameCheckQuery, [
        username,
      ]);

      if (usernameCheckResult.rows.length > 0) {
        throw new Error("Username already exists");
      }

      const insertUserQuery = `
        INSERT INTO users (username, email)
        VALUES ($1, $2)
        RETURNING id, username, email, created_at, updated_at;
      `;

      const userValues = [username, email];

      const userResult = await client.query(insertUserQuery, userValues);
      const user = userResult.rows[0];

      const insertPasswordQuery = `
        INSERT INTO user_secrets (user_id, password)
        VALUES ($1, $2);
      `;

      const passwordValues = [user.id, password];

      await client.query(insertPasswordQuery, passwordValues);

      const getRoleQuery = `
        SELECT roles.role_name
        FROM roles
        JOIN user_roles ON user_roles.role_id = roles.id
        WHERE user_roles.user_id = $1;
    `;

      const roleValues = [user.id];

      const roleResult = await client.query(getRoleQuery, roleValues);

      const role =
        roleResult.rows.length > 0 ? roleResult.rows[0].role_name : "user";

      await client.query("COMMIT");
      return { ...user, role };
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }

      if (error.message.includes("transaction")) {
        throw new Error("Transaction error occurred");
      }

      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  updateUser: async (userId, { username, email }) => {
    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const userCheckQuery = "SELECT id FROM users WHERE id = $1;";
      const userCheckValues = [userId];
      const userCheckResult = await client.query(
        userCheckQuery,
        userCheckValues,
      );

      if (userCheckResult.rows.length === 0) {
        throw new Error("User not found");
      }

      const updateUserQuery = `
        UPDATE users
        SET username = $1, email = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING id, username, email, created_at, updated_at;
      `;

      const values = [username, email, userId];

      const result = await client.query(updateUserQuery, values);
      const user = result.rows[0];

      const getRoleQuery = `
        SELECT roles.role_name
        FROM roles
        JOIN user_roles ON user_roles.role_id = roles.id
        WHERE user_roles.user_id = $1;
    `;

      const roleValues = [userId];

      const roleResult = await client.query(getRoleQuery, roleValues);

      const role =
        roleResult.rows.length > 0 ? roleResult.rows[0].role_name : "user";

      await client.query("COMMIT");
      return { ...user, role };
    } catch (error) {
      await client.query("ROLLBACK");

      if (error.code === "23505") {
        throw new Error("Username or email already exists");
      }

      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }

      if (error.message.includes("transaction")) {
        throw new Error("Transaction error occurred");
      }

      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  patchUserPassword: async (userId, password) => {
    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const userCheckQuery = "SELECT id FROM users WHERE id = $1;";
      const userCheckValues = [userId];
      const userCheckResult = await client.query(
        userCheckQuery,
        userCheckValues,
      );

      if (userCheckResult.rows.length === 0) {
        throw new Error("User not found");
      }

      const updatePasswordQuery = `
        UPDATE user_secrets
        SET password = $1, updated_at = NOW()
        WHERE user_id = $2;
      `;

      const values = [password, userId];

      await client.query(updatePasswordQuery, values);

      const getRoleQuery = `
        SELECT roles.role_name
        FROM roles
        JOIN user_roles ON user_roles.role_id = roles.id
        WHERE user_roles.user_id = $1;
    `;

      const roleValues = [userId];

      const roleResult = await client.query(getRoleQuery, roleValues);

      const role =
        roleResult.rows.length > 0 ? roleResult.rows[0].role_name : "user";

      await client.query("COMMIT");
      return { userId, password, role };
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }

      if (error.message.includes("transaction")) {
        throw new Error("Transaction error occurred");
      }

      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  deleteUser: async (userId) => {
    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const userCheckQuery = "SELECT id FROM users WHERE id = $1;";
      const userCheckValues = [userId];
      const userCheckResult = await client.query(
        userCheckQuery,
        userCheckValues,
      );

      if (userCheckResult.rows.length === 0) {
        throw new Error("User not found");
      }

      const deleteUserQuery = `
        DELETE FROM users
        WHERE id = $1;
      `;

      const values = [userId];

      const result = await client.query(deleteUserQuery, values);
      const user = result.rowCount > 0;

      await client.query("COMMIT");
      return user;
    } catch (error) {
      await client.query("ROLLBACK");

      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }

      if (error.message.includes("transaction")) {
        throw new Error("Transaction error occurred");
      }

      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  getPaginatedUsersProfile: async (limit, offset) => {
    let client;
    try {
      client = await pool.connect();
      const query = `
          SELECT 
              users.id AS user_id, 
              users.username, 
              users.email, 
              users.created_at, 
              users.updated_at, 
              profiles.id AS profile_id, 
              profiles.first_name, 
              profiles.last_name, 
              profiles.bio, 
              profiles.profile_picture,
              profiles.age,
              countries.country_name AS country,
              roles.role_name AS role
          FROM users
          LEFT JOIN profiles ON users.id = profiles.user_id
          LEFT JOIN countries ON profiles.country_id = countries.id
          LEFT JOIN user_roles ON users.id = user_roles.user_id
          LEFT JOIN roles ON user_roles.role_id = roles.id
          LIMIT $1 
          OFFSET $2;
      `;

      const values = [limit, offset];
      const result = await client.query(query, values);
      return result.rows;
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }

      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  searchUserProfiles: async (searchTerm) => {
    let client;
    try {
      client = await pool.connect();
      const query = `
            SELECT 
                users.id AS user_id, 
                users.username, 
                users.email, 
                profiles.id AS profile_id, 
                profiles.first_name, 
                profiles.last_name, 
                profiles.bio, 
                profiles.profile_picture, 
                profiles.age,
                countries.country_name AS country,
                roles.role_name AS role
            FROM users
            LEFT JOIN profiles ON users.id = profiles.user_id
            LEFT JOIN countries ON profiles.country_id = countries.id
            LEFT JOIN user_roles ON users.id = user_roles.user_id
            LEFT JOIN roles ON user_roles.role_id = roles.id
            WHERE 
                users.username ILIKE $1 OR
                users.email ILIKE $1 OR
                profiles.first_name ILIKE $1 OR
                profiles.last_name ILIKE $1;
        `;
      const values = [`%${searchTerm}%`];
      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error("No user profiles found");
      }

      return result.rows;
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }
      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  getUserProfileById: async (userId) => {
    let client;
    try {
      client = await pool.connect();
      const query = `
          SELECT 
            users.id AS user_id, 
            profiles.id AS profile_id, 
            profiles.first_name, 
            profiles.last_name, 
            profiles.bio, 
            profiles.profile_picture, 
            profiles.age,
            countries.country_name AS country,
            roles.role_name AS role
          FROM users
          LEFT JOIN profiles ON users.id = profiles.user_id
          LEFT JOIN countries ON profiles.country_id = countries.id
          LEFT JOIN user_roles ON users.id = user_roles.user_id
          LEFT JOIN roles ON user_roles.role_id = roles.id
          WHERE users.id = $1;
        `;

      const values = [userId];

      const result = await client.query(query, values);

      if (result.rows.length === 0) {
        throw new Error("User not found");
      }

      return result.rows[0];
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }
      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  createUserProfile: async (
    userId,
    firstName,
    lastName,
    bio,
    profilePicture,
    age,
    country,
  ) => {
    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const userCheckQuery = "SELECT id FROM users WHERE id = $1;";
      const userCheckValues = [userId];
      const userCheckResult = await client.query(
        userCheckQuery,
        userCheckValues,
      );

      if (userCheckResult.rows.length === 0) {
        throw new Error("User not found");
      }

      const countryCheckQuery =
        "SELECT id FROM countries WHERE country_name = $1;";
      const countryCheckValues = [country];
      const countryCheckResult = await client.query(
        countryCheckQuery,
        countryCheckValues,
      );

      const countryId = countryCheckResult.rows[0].id;

      if (countryCheckResult.rows.length === 0) {
        throw new Error("Country not found");
      }

      const insertProfileQuery = `
            INSERT INTO profiles (user_id, first_name, last_name, bio, profile_picture, age, country_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, user_id, first_name, last_name, bio, profile_picture, age, country_id, created_at, updated_at;
        `;

      const profileValues = [
        userId,
        firstName,
        lastName,
        bio,
        profilePicture,
        age,
        countryId,
      ];
      const profileResult = await client.query(
        insertProfileQuery,
        profileValues,
      );
      const profile = profileResult.rows[0];

      await client.query("COMMIT");
      return profile;
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "23505") {
        throw new Error("Profile already exists for this user");
      }

      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }

      if (error.message.includes("transaction")) {
        throw new Error("Transaction error occurred");
      }

      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  getTotalUsersCount: async () => {
    let client;
    try {
      client = await pool.connect();
      const query = "SELECT COUNT(*) FROM users;";
      const result = await client.query(query);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }
      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  sortUserProfiles: async (sortBy, sortOrder = "ASC") => {
    let client;
    try {
      client = await pool.connect();

      const query = `
          SELECT 
              users.id AS user_id, 
              users.username, 
              users.email, 
              profiles.id AS profile_id, 
              profiles.first_name, 
              profiles.last_name, 
              profiles.bio, 
              profiles.profile_picture, 
              profiles.age,
              countries.country_name AS country,
              roles.role_name AS role
          FROM users
          LEFT JOIN profiles ON users.id = profiles.user_id
          LEFT JOIN countries ON profiles.country_id = countries.id
          LEFT JOIN user_roles ON users.id = user_roles.user_id
          LEFT JOIN roles ON user_roles.role_id = roles.id
          ORDER BY ${sortBy} ${sortOrder};
      `;
      const result = await client.query(query);

      if (result.rows.length === 0) {
        throw new Error("No user profiles found");
      }

      return result.rows;
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }
      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  countUsersByCountry: async () => {
    let client;
    try {
      client = await pool.connect();
      const query = `
            SELECT 
                countries.country_name AS country,
                COUNT(users.id) AS user_count
            FROM users
            LEFT JOIN profiles ON users.id = profiles.user_id
            LEFT JOIN countries ON profiles.country_id = countries.id
            GROUP BY countries.country_name;
        `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }
      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  updateUserProfile: async (
    userId,
    firstName,
    lastName,
    bio,
    profilePicture,
    age,
    country,
  ) => {
    let client;
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const userCheckQuery = "SELECT id FROM users WHERE id = $1;";
      const userCheckResult = await client.query(userCheckQuery, [userId]);
      if (userCheckResult.rows.length === 0) {
        throw new Error("User not found");
      }

      const profileCheckQuery = "SELECT id FROM profiles WHERE user_id = $1;";
      const profileCheckResult = await client.query(profileCheckQuery, [
        userId,
      ]);
      if (profileCheckResult.rows.length === 0) {
        throw new Error("Profile not found");
      }

      const countryCheckQuery =
        "SELECT id FROM countries WHERE country_name = $1;";
      const countryCheckResult = await client.query(countryCheckQuery, [
        country,
      ]);
      if (countryCheckResult.rows.length === 0) {
        throw new Error("Country not found");
      }
      const countryId = countryCheckResult.rows[0].id;

      const updateProfileQuery = `
          UPDATE profiles
          SET
              first_name = $1,
              last_name = $2,
              bio = $3,
              profile_picture = $4,
              age = $5,
              country_id = $6,
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $7
          RETURNING id, user_id, first_name, last_name, bio, profile_picture, age, country_id, created_at, updated_at;
      `;
      const updateProfileValues = [
        firstName,
        lastName,
        bio,
        profilePicture,
        age,
        countryId,
        userId,
      ];
      const profileResult = await client.query(
        updateProfileQuery,
        updateProfileValues,
      );
      const profile = profileResult.rows[0];

      await client.query("COMMIT");

      return profile;
    } catch (error) {
      await client.query("ROLLBACK");

      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }
      if (error.message.includes("transaction")) {
        throw new Error("Transaction error occurred");
      }
      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },

  getUsersProfile: async () => {
    let client;
    try {
      client = await pool.connect();
      const query = `
      SELECT 
        users.id AS user_id, 
        users.username, 
        users.email, 
        profiles.id AS profile_id, 
        profiles.first_name, 
        profiles.last_name, 
        profiles.bio, 
        profiles.profile_picture, 
        profiles.age, 
        countries.country_name AS country,
        profiles.created_at, 
        profiles.updated_at
      FROM users
      LEFT JOIN profiles ON users.id = profiles.user_id
      LEFT JOIN countries ON profiles.country_id = countries.id;
    `;
      const result = await client.query(query);
      return result.rows;
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        throw new Error("Database connection was refused");
      }
      throw new Error(error.message);
    } finally {
      if (client) {
        client.release();
      }
    }
  },
};

export default usersModel;
