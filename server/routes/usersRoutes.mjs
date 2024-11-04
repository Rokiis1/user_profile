import express from "express";

import { usersController } from "../controllers/index.mjs";

const router = express.Router();

router.get("/", usersController.getUsers);
router.get("/profile", usersController.getUsersProfile);
router.get("/search", usersController.searchUserProfiles);
router.get("/sort", usersController.sortUserProfiles);
router.get("/count-by-country", usersController.countUsersByCountry);
router.get("/paginated", usersController.getPaginatedUsersProfile);
router.get("/:userId", usersController.getUserById);
router.get("/:userId/profile", usersController.getUserProfileById);

router.post("/", usersController.createUser);
router.post("/:userId/profile", usersController.createUserProfile);

router.put("/:userId", usersController.updateUser);
router.put("/:userId/profile", usersController.updateUserProfile);

router.patch("/:userId", usersController.patchUserPassword);

router.delete("/:userId", usersController.deleteUser);

export default router;
