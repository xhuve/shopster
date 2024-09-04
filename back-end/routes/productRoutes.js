import express from "express";
const router = express.Router();

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { adminRoutes, protectRoutes } from "../middleware/authMiddleware.js";

router.route("/top").get(getTopProducts);
router
  .route("/")
  .get(getAllProducts)
  .post(protectRoutes, adminRoutes, createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protectRoutes, adminRoutes, updateProduct)
  .delete(protectRoutes, adminRoutes, deleteProduct);
router.route("/:id/reviews").post(protectRoutes, createProductReview);

export default router;
