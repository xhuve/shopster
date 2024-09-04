import express from "express";
const router = express.Router();
import {
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  registerUser,
  addProductToWishlist,
  getUserWishlistProducts,
} from "../controllers/userController.js";
import { adminRoutes, protectRoutes } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(registerUser)
  .get(protectRoutes, adminRoutes, getAllUsers);
router
  .route("/wishlist")
  .get(getUserWishlistProducts)
  .post(addProductToWishlist);
router.post("/login", authUser);
router.route("/logout").get(protectRoutes, logoutUser);
router
  .route("/profile")
  .get(protectRoutes, getUserProfile)
  .put(protectRoutes, updateUserProfile);
router
  .route("/:id")
  .delete(protectRoutes, adminRoutes, deleteUser)
  .get(protectRoutes, adminRoutes, getUserById)
  .put(protectRoutes, adminRoutes, updateUser);

export default router;
