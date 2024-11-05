import express from "express";

import { usersController } from "../controllers/index.mjs";
import { userValidationSchema } from "../schemas/index.mjs";
import { schemaValidator, validateCountry } from "../middlewares/index.mjs";

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/profile", usersController.getUsersProfile);
router.get(
  "/search",
  schemaValidator(userValidationSchema.searchUserProfilesSchema, "query"),
  usersController.searchUserProfiles,
);
router.get(
  "/sort",
  schemaValidator(userValidationSchema.sortUserProfilesSchema, "query"),
  usersController.sortUserProfiles,
);
router.get("/count-by-country", usersController.countUsersByCountry);
router.get(
  "/paginated",
  schemaValidator(userValidationSchema.searchUserProfilesSchema, "query"),
  usersController.getPaginatedUsersProfile,
);
router.get(
  "/:userId",
  schemaValidator(userValidationSchema.userIdSchema, "params"),
  usersController.getUserById,
);
router.get(
  "/:userId/profile",
  schemaValidator(userValidationSchema.userIdSchema, "params"),
  usersController.getUserProfileById,
);

router.post(
  "/",
  schemaValidator(userValidationSchema.createUserSchema, "body"),
  usersController.createUser,
);
router.post(
  "/:userId/profile",
  schemaValidator(userValidationSchema.userIdSchema, "params"),
  schemaValidator(userValidationSchema.createProfileSchema, "body"),
  validateCountry,
  usersController.createUserProfile,
);

router.put(
  "/:userId",
  schemaValidator(userValidationSchema.userIdSchema, "params"),
  schemaValidator(userValidationSchema.updateUserSchema, "body"),
  usersController.updateUser,
);
router.put(
  "/:userId/profile",
  schemaValidator(userValidationSchema.userIdSchema, "params"),
  schemaValidator(userValidationSchema.updateProfileSchema, "body"),
  validateCountry,
  usersController.updateUserProfile,
);

router.patch(
  "/:userId",
  schemaValidator(userValidationSchema.userIdSchema, "params"),
  schemaValidator(userValidationSchema.updatePasswordSchema, "body"),
  usersController.patchUserPassword,
);

router.delete(
  "/:userId",
  schemaValidator(userValidationSchema.userIdSchema, "params"),
  usersController.deleteUser,
);

export default router;
