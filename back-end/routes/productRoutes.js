import express from "express"
const router = express.Router()
import { createProduct, getAllProducts, getProductById } from "../controllers/productController.js";
import { adminRoutes, protectRoutes } from "../middleware/authMiddleware.js";

router.route('/').get(getAllProducts).post(protectRoutes, adminRoutes, createProduct)
router.route('/:id').get(getProductById)

export default router