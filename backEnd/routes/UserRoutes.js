import express from "express";
import {
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  unfollowUser,
  updateUser,
} from "../Controllers/userControler.js";
import authMiddleWare from "../MiddleWare/AuthMiddleWare.js";
const router = express.Router();

router.get("/", getAllUsers);
router
  .route("/:id")
  .get(getUser)
  .put(authMiddleWare, updateUser)
  .delete(authMiddleWare, deleteUser);
router.route(":id/follow").put(authMiddleWare, followUser);
router.route(":id/unfollow", authMiddleWare, unfollowUser);

export default router;
