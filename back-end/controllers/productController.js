import asyncHandler from "../middleware/asyncHandler";
import Product from "../models/productModel";

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
})

export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product)
        res.json(product);
    else {
        res.status(404)
        throw new Error("Resource not found")
    }
})