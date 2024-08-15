import express from "express"
const router = express.Router()
import { getAllProducts, getProductById } from "../controllers/productController.js";

router.get('/', getAllProducts)

router.get('/:id', getProductById)

export default router