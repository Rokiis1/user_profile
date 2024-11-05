export const userValidationSchema = {
  userIdSchema: {
    type: "object",
    required: ["userId"],
    properties: {
      userId: {
        type: "string",
        pattern: "^[0-9]+$",
        errorMessage: {
          pattern: "User ID must contain only digits",
        },
      },
    },
    additionalProperties: false,
  },
  createUserSchema: {
    type: "object",
    required: ["username", "email", "password"],
    properties: {
      username: {
        type: "string",
        minLength: 6,
        maxLength: 50,
        errorMessage: {
          type: "Username must be a string",
          minLength: "Username must be at least 6 characters long",
          maxLength: "Username must be at most 50 characters long",
        },
      },
      email: {
        type: "string",
        format: "email",
        maxLength: 100,
        errorMessage: {
          type: "Email must be a string",
          format: "Email must be a valid email address",
          maxLength: "Email must be at most 100 characters long",
        },
      },
      password: {
        type: "string",
        minLength: 8,
        maxLength: 255,
        pattern:
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        errorMessage: {
          type: "Password must be a string",
          minLength: "Password must be at least 8 characters long",
          maxLength: "Password must be at most 255 characters long",
          pattern:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
      },
    },
    additionalProperties: false,
    errorMessage: {
      type: "Request body must be an object",
      required: {
        username: "Username is required",
        email: "Email is required",
        password: "Password is required",
      },
    },
  },
  createProfileSchema: {
    type: "object",
    required: ["country"],
    properties: {
      firstName: {
        type: "string",
        minLength: 1,
        maxLength: 50,
        errorMessage: {
          type: "First name must be a string",
          maxLength: "First name must be at most 50 characters long",
        },
      },
      lastName: {
        type: "string",
        minLength: 1,
        maxLength: 50,
        errorMessage: {
          type: "Last name must be a string",
          maxLength: "Last name must be at most 50 characters long",
        },
      },
      bio: {
        type: "string",
        errorMessage: {
          type: "Bio must be a string",
        },
      },
      profilePicture: {
        type: "string",
        maxLength: 255,
        format: "uri",
        errorMessage: {
          type: "Profile picture must be a string",
          maxLength: "Profile picture URL must be at most 255 characters long",
          format: "Profile picture must be a valid URL",
        },
      },
      age: {
        type: "integer",
        minimum: 0,
        errorMessage: {
          type: "Age must be an integer",
          minimum: "Age must be a non-negative integer",
        },
      },
      country: {
        type: "string",
        maxLength: 100,
        errorMessage: {
          type: "Country must be a string",
          maxLength: "Country name must be at most 100 characters long",
        },
      },
    },
    additionalProperties: false,
    errorMessage: {
      type: "Request parameters must be an object",
      required: {
        country: "Country is required",
      },
    },
  },
  updateUserSchema: {
    type: "object",
    required: ["username", "email"],
    properties: {
      username: {
        type: "string",
        minLength: 6,
        maxLength: 50,
        errorMessage: {
          type: "Username must be a string",
          minLength: "Username must be at least 6 characters long",
          maxLength: "Username must be at most 50 characters long",
        },
      },
      email: {
        type: "string",
        format: "email",
        maxLength: 100,
        errorMessage: {
          type: "Email must be a string",
          format: "Email must be a valid email address",
          maxLength: "Email must be at most 100 characters long",
        },
      },
    },
    additionalProperties: false,
    errorMessage: {
      type: "Request body must be an object",
      required: {
        username: "Username is required",
        email: "Email is required",
      },
    },
  },
  updateProfileSchema: {
    type: "object",
    properties: {
      firstName: {
        type: "string",
        minLength: 1,
        maxLength: 50,
        errorMessage: {
          type: "First name must be a string",
          maxLength: "First name must be at most 50 characters long",
        },
      },
      lastName: {
        type: "string",
        minLength: 1,
        maxLength: 50,
        errorMessage: {
          type: "Last name must be a string",
          maxLength: "Last name must be at most 50 characters long",
        },
      },
      bio: {
        type: "string",
        errorMessage: {
          type: "Bio must be a string",
        },
      },
      profilePicture: {
        type: "string",
        maxLength: 255,
        format: "uri",
        errorMessage: {
          type: "Profile picture must be a string",
          maxLength: "Profile picture URL must be at most 255 characters long",
          format: "Profile picture must be a valid URL",
        },
      },
      age: {
        type: "integer",
        minimum: 0,
        errorMessage: {
          type: "Age must be an integer",
          minimum: "Age must be a non-negative integer",
        },
      },
      country: {
        type: "string",
        maxLength: 100,
        errorMessage: {
          type: "Country must be a string",
          maxLength: "Country name must be at most 100 characters long",
        },
      },
    },
    additionalProperties: false,
  },
  updatePasswordSchema: {
    type: "object",
    required: ["password"],
    properties: {
      password: {
        type: "string",
        minLength: 8,
        maxLength: 255,
        pattern:
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
        errorMessage: {
          type: "Password must be a string",
          minLength: "Password must be at least 8 characters long",
          maxLength: "Password must be at most 255 characters long",
          pattern:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        },
      },
    },
  },
  searchUserProfilesSchema: {
    type: "object",
    required: ["query"],
    properties: {
      query: {
        type: "string",
        minLength: 3,
        errorMessage: {
          type: "Query must be a string",
          minLength: "Query must not be empty",
        },
      },
    },
    additionalProperties: false,
  },
  sortUserProfilesSchema: {
    type: "object",
    required: ["sortBy"],
    properties: {
      sortBy: {
        type: "string",
        enum: ["username", "email", "first_name", "last_name"],
        errorMessage: {
          type: "SortBy must be a string",
          enum: "SortBy must be one of the following: username, email, first_name, last_name",
        },
      },
      sortOrder: {
        type: "string",
        enum: ["ASC", "DESC"],
        errorMessage: {
          type: "SortOrder must be a string",
          enum: "SortOrder must be either 'ASC' or 'DESC'",
        },
      },
    },
    additionalProperties: false,
    errorMessage: {
      type: "Request parameters must be an object",
      required: {
        sortBy: "SortBy parameter is required",
      },
    },
  },
  paginationSchema: {
    type: "object",
    required: ["page", "limit"],
    properties: {
      page: {
        type: "integer",
        minimum: 1,
        errorMessage: {
          type: "Page must be an integer",
          minimum: "Page must be a positive integer",
        },
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
        errorMessage: {
          type: "Limit must be an integer",
          minimum: "Limit must be a positive integer",
          maximum: "Limit must be at most 100",
        },
      },
    },
    additionalProperties: false,
    errorMessage: {
      type: "Request parameters must be an object",
      required: {
        page: "Page parameter is required",
        limit: "Limit parameter is required",
      },
    },
  },
};
