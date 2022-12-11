import express from "express";
import {
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  unfollowUser,
  updateUser,
} from "../Controllers/userControler.js";
import authMiddleware from "../MiddleWare/AuthMiddleware.js";
const router = express.Router();

router.get("/", getAllUsers);
router
  .route("/:id")
  .get(getUser)
  .put(authMiddleware, updateUser)
  .delete(authMiddleware, deleteUser);
router.route(":id/follow").put(authMiddleware, followUser);
router.route(":id/unfollow", authMiddleware, unfollowUser);

export default router;
