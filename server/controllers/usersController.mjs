import { usersModel } from "../models/index.mjs";

const usersController = {
  getUsers: async (req, res) => {
    try {
      const users = await usersModel.getUsers();

      res.status(200).json({
        status: "success",
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      if (error.message === "No users found") {
        return res.status(404).json({
          status: "error",
          message: "No users found",
          data: [],
        });
      }

      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },

  getUserById: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await usersModel.getUserById(userId);
      res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },

  createUser: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const user = await usersModel.createUser(username, email, password);
      res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      if (error.message === "Email already exists") {
        return res.status(400).json({
          status: "error",
          message: "Email already exists",
        });
      }
      if (error.message === "Username already exists") {
        return res.status(400).json({
          status: "error",
          message: "Username already exists",
        });
      }

      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      if (error.message === "Transaction error occurred") {
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error: Transaction error occurred",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },

  updateUser: async (req, res) => {
    const { userId } = req.params;
    const { username, email } = req.body;

    try {
      const user = await usersModel.updateUser(userId, { username, email });

      res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
      if (error.message === "Username or email already exists") {
        return res.status(400).json({
          status: "error",
          message: "Username or email already exists",
        });
      }
      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      if (error.message === "Transaction error occurred") {
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error: Transaction error occurred",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },

  patchUserPassword: async (req, res) => {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password || typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Invalid password. Must be at least 8 characters long.",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: "error",
        message:
          "Invalid password. Must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }

    try {
      const user = await usersModel.patchUserPassword(userId, password);

      res.status(200).json({
        status: "success",
        message: "User password updated successfully",
        data: user,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      if (error.message === "Transaction error occurred") {
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error: Transaction error occurred",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    const { userId } = req.params;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID or user ID is missing",
      });
    }

    try {
      await usersModel.deleteUser(userId);

      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      if (error.message === "Transaction error occurred") {
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error: Transaction error occurred",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },

  createUserProfile: async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, bio, profilePicture, age, country } = req.body;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID or user ID is missing",
      });
    }

    if (
      firstName !== undefined &&
      (typeof firstName !== "string" || firstName.trim() === "")
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid first name",
      });
    }

    if (
      lastName !== undefined &&
      (typeof lastName !== "string" || lastName.trim() === "")
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid last name",
      });
    }

    if (bio !== undefined && typeof bio !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Invalid bio",
      });
    }

    if (profilePicture !== undefined && typeof profilePicture !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Invalid profile picture URL",
      });
    }

    if (age !== undefined && (isNaN(age) || age <= 0)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid age",
      });
    }

    if (
      country !== undefined &&
      (typeof country !== "string" || country.trim() === "")
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid country",
      });
    }
    try {
      const userProfile = await usersModel.createUserProfile(
        userId,
        firstName,
        lastName,
        bio,
        profilePicture,
        age,
        country,
      );

      res.status(201).json({
        status: "success",
        message: "User profile created successfully",
        data: userProfile,
      });
    } catch (error) {
      if (error.message === "Profile already exists for this user") {
        return res.status(400).json({
          status: "error",
          message: "Profile already exists for this user",
        });
      }

      if (error.message === "User not found") {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      if (error.message === "Country not found") {
        return res.status(404).json({
          status: "error",
          message: "Country not found",
        });
      }

      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      if (error.message === "Transaction error occurred") {
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error: Transaction error occurred",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error.message}`,
        error: error.message,
      });
    }
  },

  getUsersProfile: async (req, res) => {
    try {
      const usersProfile = await usersModel.getUsersProfile();
      res.status(200).json({
        status: "success",
        message: "Users profile retrieved successfully",
        data: usersProfile,
      });
    } catch (error) {
      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error, ${error.message}`,
        error: error.message,
      });
    }
  },

  getPaginatedUsersProfile: async (req, res) => {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    try {
      const users = await usersModel.getPaginatedUsersProfile(limit, offset);
      const totalUsers = await usersModel.getTotalUsersCount();
      const totalPages = Math.ceil(totalUsers / limit);

      res.status(200).json({
        status: "success",
        message: "Users with profiles and roles retrieved successfully",
        data: users,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalUsers: totalUsers,
        },
      });
    } catch (error) {
      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },

  getUserProfileById: async (req, res) => {
    const { userId } = req.params;

    try {
      const userProfile = await usersModel.getUserProfileById(userId);
      res.status(200).json({
        status: "success",
        message: "User profile retrieved successfully",
        data: userProfile,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },

  searchUserProfiles: async (req, res) => {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Query parameter is required",
      });
    }

    try {
      const userProfiles = await usersModel.searchUserProfiles(query);
      res.status(200).json({
        status: "success",
        message: "User profiles retrieved successfully",
        data: userProfiles,
      });
    } catch (error) {
      if (error.message === "No user profiles found") {
        return res.status(404).json({
          status: "error",
          message: "No user profiles found",
        });
      }

      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },

  sortUserProfiles: async (req, res) => {
    const { sortBy, sortOrder } = req.query;

    try {
      const userProfiles = await usersModel.sortUserProfiles(sortBy, sortOrder);
      res.status(200).json({
        status: "success",
        message: "User profiles retrieved successfully",
        data: userProfiles,
      });
    } catch (error) {
      if (error.message === "No user profiles found") {
        return res.status(404).json({
          status: "error",
          message: "No user profiles found",
        });
      }
      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }

      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },

  countUsersByCountry: async (req, res) => {
    try {
      const userCounts = await usersModel.countUsersByCountry();
      res.status(200).json({
        status: "success",
        message: "User counts by country retrieved successfully",
        data: userCounts,
      });
    } catch (error) {
      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },

  updateUserProfile: async (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, bio, profilePicture, age, country } = req.body;

    try {
      const updatedProfile = await usersModel.updateUserProfile(
        userId,
        firstName,
        lastName,
        bio,
        profilePicture,
        age,
        country,
      );
      res.status(200).json({
        status: "success",
        message: "User profile updated successfully",
        data: updatedProfile,
      });
    } catch (error) {
      if (error.message === "User not found") {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
      if (error.message === "Profile not found") {
        return res.status(404).json({
          status: "error",
          message: "Profile not found",
        });
      }
      if (error.message === "Country not found") {
        return res.status(404).json({
          status: "error",
          message: "Country not found",
        });
      }
      if (error.message === "Database connection was refused") {
        return res.status(503).json({
          status: "error",
          message: "Service Unavailable: Database connection was refused",
        });
      }
      if (error.message === "Transaction error occurred") {
        return res.status(500).json({
          status: "error",
          message: "Internal Server Error: Transaction error occurred",
        });
      }
      res.status(500).json({
        status: "error",
        message: `Internal Server Error: ${error.message}`,
        error: error.message,
      });
    }
  },
};

export default usersController;
